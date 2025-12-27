using SmartBell.Api.Dtos.RoomDtos;

namespace SmartBell.Api.Dtos.RecommendationDtos;

public sealed record RoomSuggestionDto(
    RoomDto Room,
    decimal PricePerNight,
    decimal Score,
    string Why
);
