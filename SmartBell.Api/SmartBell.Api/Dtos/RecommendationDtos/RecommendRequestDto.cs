using SmartBell.Domain.Enums;

namespace SmartBell.Api.Dtos.RecommendationDtos;

public sealed record RecommendRequestDto(
    DateOnly CheckIn,
    DateOnly CheckOut,
    int Adults,
    int ChildrenUnder12,
    decimal? BudgetMin,
    decimal? BudgetMax,
    bool Honeymoon,
    string Priority, // "balanced" | "price" | "features"
    RoomPreference? Preference,
    Amenity Wanted,
    bool LikesSpa,
    bool LikesGym,
    bool LikesTennis,
    bool LikesBeach
);
