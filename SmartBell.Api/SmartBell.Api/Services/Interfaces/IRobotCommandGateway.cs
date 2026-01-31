using SmartBell.Api.Dtos.RobotDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IRobotCommandGateway
{
    Task SendCommandAsync(RobotTaskCommandDto command, CancellationToken ct = default);
}

