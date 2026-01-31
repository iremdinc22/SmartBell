import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MapCanvas from "@/components/Map/MapCanvas";

import {
  connectRobotHub,
  onRobotOdom,
  offRobotOdom,
  sendMoveRobotRequest,
} from "@/services/robotHub";

import { goToRoom } from "@/services/robotTasks";

const RobotsLocation = () => {
  // Main state for our simulation robot
  const [robot, setRobot] = useState({
    id: "ZS-VB-001",
    name: "ValetBot-01",
    status: "Online",
    color: "#A8F5B4",
    battery: 92,
    pose: { x: 0.0, y: 0.0, yaw: 0.0 },
  });

  // ✅ MAP CLICK = SIM / MANUAL OVERRIDE (coordinates via SignalR)
  const sendRobotToGoal = async (x, y) => {
    try {
      const goalPayload = JSON.stringify({ robotId: robot.id, x, y });
      await sendMoveRobotRequest(goalPayload);
      console.log(`🕹️ Manual Override: X=${x.toFixed(2)}, Y=${y.toFixed(2)}`);
    } catch (err) {
      console.error("❌ Manual Override Failed:", err);
    }
  };

  // ✅ QUICK MISSIONS = NAV2 / WAYPOINTS (roomNumber via API)
  // Fallback: If API fails, use old sim coords to keep demo working.
  const sendRobotToRoom = async (roomNumber, fallbackX, fallbackY) => {
    try {
      await goToRoom(roomNumber, robot.id);
      console.log(`🏨 GoToRoom requested: room=${roomNumber} (robot=${robot.id})`);
    } catch (err) {
      console.warn("⚠️ GoToRoom API failed, fallback to sim coords:", err);

      try {
        const goalPayload = JSON.stringify({ robotId: robot.id, x: fallbackX, y: fallbackY });
        await sendMoveRobotRequest(goalPayload);
        console.log(`🎯 Fallback (Sim) dispatch to: X=${fallbackX.toFixed(2)}, Y=${fallbackY.toFixed(2)}`);
      } catch (err2) {
        console.error("❌ Command Dispatch Failed (API + fallback):", err2);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handler = (payload) => {
      if (!isMounted) return;
      try {
        const data = typeof payload === "string" ? JSON.parse(payload) : payload;
        if (data && data.robotId === "ZS-VB-001") {
          setRobot((prev) => ({
            ...prev,
            pose: {
              ...prev.pose,
              x: parseFloat(data.x),
              y: parseFloat(data.y),
            },
          }));
        }
      } catch (err) {
        console.error("❌ Data Processing Error:", err);
      }
    };

    const startConnection = async () => {
      try {
        await connectRobotHub();
        onRobotOdom(handler);
      } catch (e) {
        console.error("❌ Link Establishment Failed:", e);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      offRobotOdom(handler);
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-[#0f1115] text-white font-sans">
      {/* --- HEADER SECTION --- */}
      <header className="flex items-center justify-between border-b border-white/5 px-8 py-5 bg-[#161920] shrink-0 shadow-lg">
        <div className="flex items-center gap-5">
          <Link to="/admin/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Zenith Control Center</h1>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Fleet Management Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-tighter text-nowrap">System Health</p>
            <p className="text-sm font-medium text-green-400 font-mono tracking-widest">OPERATIONAL</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR: TELEMETRY & COMMANDS --- */}
        <aside className="w-[350px] shrink-0 border-r border-white/5 bg-[#12141a] p-8 flex flex-col gap-8 shadow-2xl overflow-y-auto scrollbar-hide">
          {/* Real-time Telemetry Card */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em]">Active Telemetry</h3>
            <div className="bg-[#1c1f26] p-5 rounded-2xl border border-white/10 space-y-5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <svg className="h-7 w-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth={1.5} />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight text-gray-100">{robot.name}</h4>
                  <p className="text-[10px] text-blue-400 font-mono uppercase italic tracking-tighter">ID: {robot.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/20 uppercase font-black block mb-1 tracking-widest">POS_X</span>
                  <span className="text-2xl font-mono text-white/90">{robot.pose.x.toFixed(2)}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/20 uppercase font-black block mb-1 tracking-widest">POS_Y</span>
                  <span className="text-2xl font-mono text-white/90">{robot.pose.y.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Autonomous Dispatch Command Center */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.2em]">Quick Missions</h3>
              <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-white/40 border border-white/5">PRESETS</span>
            </div>

            {/* ✅ Buttons now call goToRoom (Nav2/waypoints), with sim fallback coords */}
            <div className="grid gap-3">
              <button
                onClick={() => sendRobotToRoom(14, 8.5, -0.5)} // room 14 -> Kitchen
                className="group relative overflow-hidden px-6 py-4 bg-blue-600/10 border border-blue-500/30 rounded-xl hover:bg-blue-600 transition-all active:scale-95 text-left"
              >
                <span className="block text-xs text-blue-400 group-hover:text-blue-100 uppercase font-bold tracking-tighter">
                  Task: Service Delivery
                </span>
                <span className="block text-base font-semibold">Kitchen Area</span>
              </button>

              <button
                onClick={() => sendRobotToRoom(1, 2.0, 4.0)} // room 1 -> Lobby
                className="group relative overflow-hidden px-6 py-4 bg-purple-600/10 border border-purple-500/30 rounded-xl hover:bg-purple-600 transition-all active:scale-95 text-left"
              >
                <span className="block text-xs text-purple-400 group-hover:text-purple-100 uppercase font-bold tracking-tighter">
                  Task: Guest Greeting
                </span>
                <span className="block text-base font-semibold">Main Lobby</span>
              </button>

              <button
                onClick={() => sendRobotToRoom(99, 0.0, 0.0)} // room 99 -> Dock (example)
                className="group relative overflow-hidden px-6 py-4 bg-orange-600/10 border border-orange-500/30 rounded-xl hover:bg-orange-600 transition-all active:scale-95 text-left"
              >
                <span className="block text-xs text-orange-400 group-hover:text-orange-100 uppercase font-bold tracking-tighter">
                  Task: Maintenance
                </span>
                <span className="block text-base font-semibold">Charging Dock</span>
              </button>
            </div>
          </section>

          {/* Instructions Card */}
          <section className="bg-white/5 rounded-xl p-4 border border-white/10 border-dashed">
            <p className="text-[10px] text-white/40 leading-relaxed italic">
              * Click anywhere on the map to manually dispatch {robot.name} to new coordinates.
            </p>
          </section>

          {/* Battery Tracking */}
          <section className="mt-auto pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Battery Status</span>
              <span className="text-lg font-mono text-green-500">{robot.battery}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                style={{ width: `${robot.battery}%` }}
              />
            </div>
          </section>
        </aside>

        {/* --- MAIN MAP VISUALIZATION --- */}
        <main className="flex-1 relative bg-[#090a0c] p-10 flex items-center justify-center">
          <div className="h-full w-full max-w-6xl rounded-[3rem] border border-white/5 overflow-hidden relative shadow-[0_0_150px_rgba(0,0,0,1)] bg-[#12141a]">
            {/* ✅ MAP CLICK = SIM / MANUAL OVERRIDE */}
            <MapCanvas
              robots={[robot]}
              selectedRobotId={robot.id}
              onRobotClick={() => {}}
              onMapClick={(x, y) => {
                console.log("MAP CLICK:", x, y);
                sendRobotToGoal(x, y);
                }}
                />

            {/* Heads-Up Display (HUD) */}
            <div className="absolute top-8 left-8 pointer-events-none space-y-3">
              <div className="bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-[10px] font-mono text-white/60 flex items-center gap-3 shadow-2xl">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="tracking-widest italic font-bold">LIVE TELEMETRY FEED: 10Hz // FRAME: MAP_MAIN</span>
              </div>
            </div>

            {/* Manual Override Indicator */}
            <div className="absolute bottom-8 right-8 pointer-events-none flex flex-col items-end gap-2">
              <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-lg text-[9px] font-mono text-blue-400 uppercase tracking-widest">
                Manual Override Active
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                Click map to override autonomous pathing
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RobotsLocation;


