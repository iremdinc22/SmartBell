using Microsoft.Extensions.Options;
using SmartBell.Api.Dtos.RecommendationDtos;
using SmartBell.Domain.Enums;
using SmartBell.Api.Domain.Entities;

namespace SmartBell.Api.Recommendation;

public sealed class RecommendationEngine
{
    private readonly RecommendationOptions _opt;

    public RecommendationEngine(IOptions<RecommendationOptions> opt)
        => _opt = opt.Value;

    // Query sonucu gelen Room entity’leri burada skorlanır.
    public IReadOnlyList<(Room room, decimal score, string why)> Score(
        IReadOnlyList<Room> rooms,
        RecommendRequestDto req)
    {
        // ✅ Named tuple list (room, score, why)
        var list = new List<(Room room, decimal score, string why)>();

        foreach (var r in rooms)
        {
            decimal score = 0;
            var why = new List<string>();

            // 1) Amenity match (IF wanted then add)
            if (req.Wanted != Amenity.None)
            {
                var ok = (r.Amenities & req.Wanted) == req.Wanted;
                if (ok)
                {
                    score += _opt.Weights.AmenityMatch;
                    why.Add($"Amenities match (+{_opt.Weights.AmenityMatch})");
                }
                else
                {
                    // rule-based: istemediği özelliği taşımıyorsa puan yok; istersen eksi yazabilirsin
                    why.Add("Amenities not fully matched (+0)");
                }
            }

            // 2) Capacity fit (soft bonus)
            var people = req.Adults + req.ChildrenUnder12;
            if (r.Capacity >= people)
            {
                // ne kadar yakınsa o kadar iyi
                // exact fit -> full, bigger -> smaller bonus
                var diff = r.Capacity - people;

                // CapacityFit decimal olabilir; diff int -> decimal'a çeviriyoruz
                var capBonus = Math.Max(0m, _opt.Weights.CapacityFit - (decimal)diff);

                score += capBonus;
                if (capBonus > 0) why.Add($"Capacity fit (+{capBonus:0.#})");
            }

            // 3) Price fit (budget range varsa)
            if (req.BudgetMin.HasValue || req.BudgetMax.HasValue)
            {
                var min = req.BudgetMin ?? 0m;
                var max = req.BudgetMax ?? decimal.MaxValue;

                if (r.BasePricePerNight >= min && r.BasePricePerNight <= max)
                {
                    // basit: full score
                    score += _opt.Weights.PriceFit;
                    why.Add($"Budget fit (+{_opt.Weights.PriceFit})");
                }
                else
                {
                    // range dışında: 0
                    why.Add("Budget fit (+0)");
                }
            }

            // 4) Interests (Spa/Gym/Tennis/Beach -> bonus)
            // DB tarafında bu interest’lere karşılık gelen feature/amenity mapping’i yoksa
            // sadece “soft bonus” olarak kullanıyoruz
            var interestCount =
                (req.LikesSpa ? 1 : 0) +
                (req.LikesGym ? 1 : 0) +
                (req.LikesTennis ? 1 : 0) +
                (req.LikesBeach ? 1 : 0);

            if (interestCount > 0)
            {
                // 1-4 arası ölçekle
                var interestBonus = (_opt.Weights.Interest * interestCount) / 4m;
                score += interestBonus;
                why.Add($"Interest bonus (+{interestBonus:0.#})");
            }

            // 5) Honeymoon rule
            if (req.Honeymoon && _opt.HoneymoonAllowedPreferences.Length > 0)
            {
                if (_opt.HoneymoonAllowedPreferences.Contains((int)r.Preference))
                {
                    score += _opt.Weights.PriorityBias;
                    why.Add($"Honeymoon boost (+{_opt.Weights.PriorityBias})");
                }
            }

            // 6) Priority bias (price/features/balanced)
            if (!string.IsNullOrWhiteSpace(req.Priority))
            {
                var p = req.Priority.Trim().ToLowerInvariant();

                if (p == "price")
                {
                    // ucuzluk: fiyat düşükse +bias
                    var cheapBonus = Math.Clamp(
                        10m - (r.BasePricePerNight / 100m),
                        0m,
                        _opt.Weights.PriorityBias);

                    score += cheapBonus;
                    if (cheapBonus > 0) why.Add($"Price priority (+{cheapBonus:0.#})");
                }
                else if (p == "features")
                {
                    // comfort bias: wanted varsa ve match ise extra
                    if (req.Wanted != Amenity.None && (r.Amenities & req.Wanted) == req.Wanted)
                    {
                        score += _opt.Weights.PriorityBias;
                        why.Add($"Comfort priority (+{_opt.Weights.PriorityBias})");
                    }
                }
                // balanced -> ek yok
            }

            // ✅ named tuple add
            list.Add((room: r, score: score, why: string.Join("; ", why)));
        }

        // yüksek skor önde; eşitse ucuz önce
        return list
            .OrderByDescending(x => x.score)
            .ThenBy(x => x.room.BasePricePerNight)
            .ToList();
    }
}
