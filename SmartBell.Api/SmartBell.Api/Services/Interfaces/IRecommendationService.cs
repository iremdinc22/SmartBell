using SmartBell.Api.Dtos.RecommendationDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IRecommendationService
{
    Task<IReadOnlyList<RoomSuggestionDto>> RecommendAsync(RecommendRequestDto req);
}
