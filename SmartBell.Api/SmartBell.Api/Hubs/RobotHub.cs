using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Diagnostics;

namespace SmartBell.Api.Hubs
{
    public class RobotHub : Hub
    {
        private static readonly Stopwatch _stopwatch = Stopwatch.StartNew();
        private static readonly object _odomLock = new();

        // 1. ROS2 Bridge'den gelen konum verilerini Frontend'e iletir (10Hz)
        public async Task RobotOdom(object payload)
        {
            bool shouldSend = false;
            lock (_odomLock)
            {
                if (_stopwatch.ElapsedMilliseconds > 100)
                {
                    _stopwatch.Restart();
                    shouldSend = true;
                }
            }

            if (!shouldSend) return;

            await Clients.All.SendAsync("RobotOdom", payload);
        }

        // 2. Python Bridge'den gelen durum mesajlarını Frontend'e iletir (YENİ)
        // "Hedefe Ulaşıldı", "Yolda", "Engel Var" gibi...
        public async Task RobotStatus(object payload)
        {
            // Python'dan gelen "RobotStatus" çağrısını alır, 
            // Frontend'e "ReceiveStatus" adıyla fırlatır.
            await Clients.All.SendAsync("ReceiveStatus", payload);
        }

        // 3. Web'den gelen "Şu koordinata git" isteğini karşılar (YENİ)
        // RobotsLocation.jsx içindeki "conn.invoke('MoveRobotRequest', ...)" burayı tetikler.
        public async Task MoveRobotRequest(string goalJson)
        {
            // Bu mesajı Python Bridge dinliyor.
            // Python tarafında hub_connection.on("MoveRobot", ...) demiştik.
            await Clients.All.SendAsync("MoveRobot", goalJson);
        }

        // 4. Web'den gelen manuel hız komutlarını iletir
        public async Task SendCmdVel(double linearX, double angularZ)
        {
            await Clients.All.SendAsync("CmdVel", new { linearX, angularZ });
        }
    }
}

