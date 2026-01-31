import { api } from "@/lib/api";

// Backend: POST /api/robot-tasks/go-to-room
export function goToRoom(roomNumber, robotId = "ZS-VB-001") {
  if (!roomNumber || Number(roomNumber) <= 0) {
    return Promise.reject(new Error("RoomNumber must be > 0."));
  }

  const payload = {
    roomNumber: Number(roomNumber),
    robotId, // opsiyonel
  };

  return api.post("/robot-tasks/go-to-room", payload);
}

// (Opsiyonel) Backend: POST /api/robot-tasks/cancel
export function cancelRobotTask(robotId = "ZS-VB-001") {
  return api.post("/robot-tasks/cancel", { robotId });
}
