using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Services.Interfaces;

[ApiController]
[Route("api/robot")]
public class RobotsController : ControllerBase
{
    private readonly IRobotService _robotService;

    public RobotsController(IRobotService robotService)
    {
        _robotService = robotService;
    }

    [HttpPost("update-position")]
    public async Task<IActionResult> UpdatePosition(string robotId, double x, double y)
    {
        await _robotService.UpdateRobotPositionAsync(robotId, x, y);
        return Ok("Robot position updated.");
    }
}