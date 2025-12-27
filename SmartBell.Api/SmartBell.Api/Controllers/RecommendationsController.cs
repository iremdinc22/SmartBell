using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.RecommendationDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RecommendationsController : ControllerBase
{
    private readonly IRecommendationService _svc;

    public RecommendationsController(IRecommendationService svc)
        => _svc = svc;

    [HttpPost]
    public async Task<ActionResult<IReadOnlyList<RoomSuggestionDto>>> Post([FromBody] RecommendRequestDto req)
    {
        var list = await _svc.RecommendAsync(req);
        return Ok(list);
    }
}
