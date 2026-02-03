#!/usr/bin/env python3
import json
import rclpy
import math
import time
from rclpy.node import Node
from rclpy.action import ActionClient # Action takibi için eklendi
from geometry_msgs.msg import PoseStamped, PoseWithCovarianceStamped
from nav2_msgs.action import NavigateToPose # Nav2 durum mesajları için
from action_msgs.msg import GoalStatus # Durum kodları için
from signalrcore.hub_connection_builder import HubConnectionBuilder

class RobotBridge(Node):
    def __init__(self):
        super().__init__('robot_bridge')
        
        # --- 1. AYARLAR ---
        self.robot_id = "ZS-VB-001"
        self.current_pose = {"x": 0.0, "y": 0.0, "yaw": 0.0}
        self.last_sent_pose = {"x": 0.0, "y": 0.0, "yaw": 0.0}
        self.min_dist_change = 0.05
        self.min_yaw_change = 0.1
        self.last_goal_time = 0
        self.goal_cooldown = 1.0 

        # --- 2. SIGNALR ---
        self.hub_connection = HubConnectionBuilder() \
            .with_url("http://host.docker.internal:5131/hubs/robot") \
            .with_automatic_reconnect({"type": "raw", "keep_alive_interval": 10}) \
            .build()
        
        self.hub_connection.on("MoveRobot", self.handle_move_robot)
        
        try:
            self.hub_connection.start()
            self.get_logger().info("✅ SignalR Bağlantısı Kuruldu.")
        except Exception as e:
            self.get_logger().error(f"❌ SignalR Hatası: {e}")

        # --- 3. ROS 2 PUB/SUB & ACTION ---
        # Hedefi artık ActionClient üzerinden gönderiyoruz ki sonucunu takip edebilelim
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        self.pose_sub = self.create_subscription(
            PoseWithCovarianceStamped, 
            '/amcl_pose', 
            self.pose_callback, 
            10
        )

        # --- 4. TIMERLAR ---
        self.odom_timer = self.create_timer(0.2, self.odom_timer_callback)
        self.heartbeat_timer = self.create_timer(10.0, self.heartbeat_callback)

    def quaternion_to_yaw(self, q):
        siny_cosp = 2 * (q.w * q.z + q.x * q.y)
        cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z)
        return math.atan2(siny_cosp, cosy_cosp)

    def pose_callback(self, msg):
        self.current_pose["x"] = round(msg.pose.pose.position.x, 3)
        self.current_pose["y"] = round(msg.pose.pose.position.y, 3)
        self.current_pose["yaw"] = round(self.quaternion_to_yaw(msg.pose.pose.orientation), 2)

    def odom_timer_callback(self):
        curr = self.current_pose
        last = self.last_sent_pose
        dist_diff = math.sqrt((curr["x"] - last["x"])**2 + (curr["y"] - last["y"])**2)
        yaw_diff = abs(curr["yaw"] - last["yaw"])

        if dist_diff >= self.min_dist_change or yaw_diff >= self.min_yaw_change:
            self.send_to_signalr(curr["x"], curr["y"], curr["yaw"], "HAREKET")

    # --- 🚀 YENİ: NAVİGASYON DURUM TAKİBİ ---
    def handle_move_robot(self, args):
        now = time.time()
        if now - self.last_goal_time < self.goal_cooldown:
            return

        try:
            data = json.loads(args[0]) if isinstance(args[0], str) else args[0]
            
            # Action Server hazır mı kontrol et
            if not self.nav_client.wait_for_server(timeout_sec=1.0):
                self.send_status_to_web("Hata: Navigasyon Servisi Kapalı")
                return

            goal_msg = NavigateToPose.Goal()
            goal_msg.pose.header.frame_id = "map"
            goal_msg.pose.pose.position.x = float(data['x'])
            goal_msg.pose.pose.position.y = float(data['y'])
            goal_msg.pose.pose.orientation.w = 1.0
            
            self.send_status_to_web("Yolda") # Hareket başladığında durum gönder
            
            send_goal_future = self.nav_client.send_goal_async(goal_msg)
            send_goal_future.add_done_callback(self.goal_response_callback)
            
            self.last_goal_time = now
        except Exception as e:
            self.get_logger().error(f"❌ Komut Hatası: {e}")

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.send_status_to_web("Hedef Reddedildi")
            return

        self.get_result_future = goal_handle.get_result_async()
        self.get_result_future.add_done_callback(self.get_result_callback)

    def get_result_callback(self, future):
        status = future.result().status
        if status == GoalStatus.STATUS_SUCCEEDED:
            self.send_status_to_web("Hedefe Ulaşıldı")
        elif status == GoalStatus.STATUS_ABORTED:
            self.send_status_to_web("Engel Var veya İptal Edildi")
        else:
            self.send_status_to_web("Bilinmeyen Hata")

    def send_status_to_web(self, status_text):
        """Web'e robotun durumunu gönderir."""
        try:
            payload = {"robotId": self.robot_id, "status": status_text}
            # Backend'inde 'ReceiveStatus' adında bir metod olduğunu varsayıyorum
            self.hub_connection.send("RobotStatus", [json.dumps(payload)])
            self.get_logger().info(f"📢 Durum Web'e iletildi: {status_text}")
        except Exception as e:
            self.get_logger().warn(f"⚠️ Durum iletilemedi: {e}")

    def heartbeat_callback(self):
        self.send_to_signalr(self.current_pose["x"], self.current_pose["y"], self.current_pose["yaw"], "HEARTBEAT")

    def send_to_signalr(self, x, y, yaw, reason):
        try:
            self.last_sent_pose = {"x": x, "y": y, "yaw": yaw}
            payload = {"robotId": self.robot_id, "x": x, "y": y, "yaw": yaw}
            self.hub_connection.send("RobotOdom", [json.dumps(payload)])
        except Exception as e:
            pass

def main():
    rclpy.init()
    node = RobotBridge()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.hub_connection.stop()
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
    
    