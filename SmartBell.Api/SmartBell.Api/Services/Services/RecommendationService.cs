using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.RecommendationDtos;
using SmartBell.Api.Dtos.RoomDtos;
using SmartBell.Api.Recommendation;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Services;

public sealed class RecommendationService : IRecommendationService
{
    private readonly IGenericRepository<Room> _roomRepo;
    private readonly IMapper _mapper;
    private readonly RecommendationEngine _engine;
    private readonly RecommendationOptions _opt;

    public RecommendationService(
        IGenericRepository<Room> roomRepo,
        IMapper mapper,
        RecommendationEngine engine,
        IOptions<RecommendationOptions> opt)
    {
        _roomRepo = roomRepo;
        _mapper = mapper;
        _engine = engine;
        _opt = opt.Value;
    }

    public async Task<IReadOnlyList<RoomSuggestionDto>> RecommendAsync(RecommendRequestDto req)
    {
        var people = req.Adults + req.ChildrenUnder12;

        // 1) Query (read) - burada temel filtreleri uygula (hard rules)
        var q = _roomRepo.Query()
            .AsNoTracking()
            .Where(r => r.Status == "Active")
            .Where(r => r.Capacity >= people);

        // preference filtre (Any değilse)
        if (req.Preference is not null && req.Preference != RoomPreference.Any)
            q = q.Where(r => r.Preference == req.Preference);

        // wanted amenities (hard filter istersen burada, soft filter istersen engine’de)
        // Biz soft scoring yapıyoruz ama "Wanted" seçtiyse sonuçları daraltmak istiyorsan aç:
        if (req.Wanted != Amenity.None)
            q = q.Where(r => (r.Amenities & req.Wanted) == req.Wanted);

        // budget (hard filter)
        if (req.BudgetMin.HasValue)
            q = q.Where(r => r.BasePricePerNight >= req.BudgetMin.Value);
        if (req.BudgetMax.HasValue)
            q = q.Where(r => r.BasePricePerNight <= req.BudgetMax.Value);

        var rooms = await q.ToListAsync();

        // 2) Score in Engine
        var scored = _engine.Score(rooms, req);

        // 3) map -> DTO + limit
        var top = scored.Take(Math.Max(1, _opt.Limits.MaxResults)).ToList();

        var result = top.Select(x =>
        {
            var roomDto = _mapper.Map<RoomDto>(x.room);
            return new RoomSuggestionDto(
                Room: roomDto,
                PricePerNight: x.room.BasePricePerNight,
                Score: Math.Round(x.score, 2),
                Why: x.why
            );
        }).ToList();

        return result;
    }
}
