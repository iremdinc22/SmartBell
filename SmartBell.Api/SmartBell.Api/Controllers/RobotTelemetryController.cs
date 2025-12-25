using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SmartBell.Api.Dtos.RobotDtos;
using SmartBell.Api.Hubs;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/robot-telemetry")]
public class RobotTelemetryController : ControllerBase
{
    private readonly IRobotPoseStore _store;
    private readonly IHubContext<RobotHub> _hub;

    public RobotTelemetryController(IRobotPoseStore store, IHubContext<RobotHub> hub)
    {
        _store = store;
        _hub = hub;
    }

    [HttpPost("pose")]
    public async Task<IActionResult> PostPose([FromBody] RobotPoseDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Id))
            return BadRequest("Id is required.");

        _store.Upsert(dto);
        await _hub.Clients.All.SendAsync("RobotPoseUpdated", dto);

        return Ok(new { ok = true });
    }

    [HttpGet("poses")]
    public IActionResult GetPoses() => Ok(_store.GetAll());
}
