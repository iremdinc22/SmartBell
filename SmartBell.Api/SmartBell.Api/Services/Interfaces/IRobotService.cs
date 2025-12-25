namespace SmartBell.Api.Services.Interfaces;

public interface IRobotService
{
    Task UpdateRobotPositionAsync(string robotId, double x, double y);
}