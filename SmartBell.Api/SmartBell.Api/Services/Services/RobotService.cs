using Microsoft.AspNetCore.SignalR;
using SmartBell.Api.Hubs;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Services.Implementations
{
    public class RobotService : IRobotService
    {
        private readonly IHubContext<RobotHub> _hubContext;

        public RobotService(IHubContext<RobotHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task UpdateRobotPositionAsync(string robotId, double x, double y)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveRobotPosition", robotId, x, y);
        }
    }
}