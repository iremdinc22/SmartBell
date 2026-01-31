using Microsoft.AspNetCore.SignalR;
using SmartBell.Api.Dtos.RobotDtos;
using SmartBell.Api.Hubs;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Services.Implementations.Robot;

public class SignalRRobotCommandGateway : IRobotCommandGateway
{
    private readonly IHubContext<RobotHub> _hub;

    public SignalRRobotCommandGateway(IHubContext<RobotHub> hub)
    {
        _hub = hub;
    }

    public async Task SendCommandAsync(RobotTaskCommandDto command, CancellationToken ct = default)
    {
        // RobotHub'da zaten "MoveRobot" event'ini tüm clientlara basıyordun.
        // Python Bridge bu event'i dinleyecek.
        await _hub.Clients.All.SendAsync("MoveRobot", command, ct);
    }
}
