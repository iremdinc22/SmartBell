using Microsoft.AspNetCore.SignalR;

namespace SmartBell.Api.Hubs
{
    public class RobotHub : Hub
    {
        // Backend → tüm client'lara konum gönderir
        public async Task SendRobotPosition(string robotId, double x, double y)
        {
            await Clients.All.SendAsync("ReceiveRobotPosition", robotId, x, y);
        }
        
    }
}