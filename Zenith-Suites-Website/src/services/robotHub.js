import * as signalR from "@microsoft/signalr";

let connection = null;

function createConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    // Backend portunun 5131 ve endpoint'in /hubs/robot olduğundan eminiz
    .withUrl("http://localhost:5131/hubs/robot", { withCredentials: true })
    .withAutomaticReconnect()
    .build();

  return connection;
}

export async function connectRobotHub() {
  const conn = createConnection();
  if (conn.state === "Disconnected") {
    try {
      await conn.start();
      console.log("✅ SignalR Connection Established");
    } catch (err) {
      console.error("❌ SignalR Connection Error: ", err);
    }
  }
  return conn;
}

// Robotun konum verisini dinlemek için
export function onRobotOdom(callback) {
  const conn = createConnection();
  conn.on("RobotOdom", callback);
}

export function offRobotOdom(callback) {
  const conn = createConnection();
  conn.off("RobotOdom", callback);
}

// Otonom Navigasyon komutu göndermek için (YENİ)
export async function sendMoveRobotRequest(goalPayload) {
  const conn = await connectRobotHub();
  return conn.invoke("MoveRobotRequest", goalPayload);
}

// Klavye ile manuel hız göndermek için
export function sendCmdVel(linearX, angularZ) {
  const conn = createConnection();
  return conn.invoke("SendCmdVel", linearX, angularZ);
}

export function disconnectRobotHub() {
  if (connection) {
    connection.stop();
    connection = null;
  }
}