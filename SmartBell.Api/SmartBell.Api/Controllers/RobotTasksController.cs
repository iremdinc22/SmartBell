using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.RobotDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/robot-tasks")]
public class RobotTasksController : ControllerBase
{
    private readonly IRobotCommandGateway _gateway;

    public RobotTasksController(IRobotCommandGateway gateway)
    {
        _gateway = gateway;
    }

    public record GoToRoomRequest(int RoomNumber, string? RobotId);

    [HttpPost("go-to-room")]
    public async Task<IActionResult> GoToRoom([FromBody] GoToRoomRequest req, CancellationToken ct)
    {
        if (req.RoomNumber <= 0)
            return BadRequest("RoomNumber must be > 0.");

        // İstersen WaypointKey'yi backend üretsin (web bilmesin)
        var cmd = new RobotTaskCommandDto
        {
            Type = "GO_TO_ROOM",
            RobotId = req.RobotId,
            RoomNumber = req.RoomNumber,
            WaypointKey = $"room_{req.RoomNumber}"
        };

        await _gateway.SendCommandAsync(cmd, ct);
        return Ok(new { ok = true, sent = cmd });
    }

    public record CancelTaskRequest(string? RobotId);

    [HttpPost("cancel")]
    public async Task<IActionResult> Cancel([FromBody] CancelTaskRequest req, CancellationToken ct)
    {
        var cmd = new RobotTaskCommandDto
        {
            Type = "CANCEL_TASK",
            RobotId = req.RobotId
        };

        await _gateway.SendCommandAsync(cmd, ct);
        return Ok(new { ok = true });
    }
}
