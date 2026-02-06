ROS_CONTAINER=ros2_sim_container
ROS_SETUP=source /opt/ros/humble/setup.bash
SIM_TIME ?= False

sim:
	docker exec -it $(ROS_CONTAINER) bash -c "$(ROS_SETUP) && python3 /root/maps/simple_sim.py"

foxglove:
	docker exec -it $(ROS_CONTAINER) bash -c "$(ROS_SETUP) && ros2 launch foxglove_bridge foxglove_bridge_launch.xml"

nav2:
	docker exec -it $(ROS_CONTAINER) bash -c "$(ROS_SETUP) && ros2 launch nav2_bringup bringup_launch.py use_sim_time:=$(SIM_TIME) map:=/root/maps/koridor_haritasi.yaml"

initialpose:
	docker exec -it $(ROS_CONTAINER) bash -c "$(ROS_SETUP) && ros2 topic pub -1 /initialpose geometry_msgs/msg/PoseWithCovarianceStamped '{header: {frame_id: map}, pose: {pose: {position: {x: 0.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}}'"

bridge:
	docker exec -it $(ROS_CONTAINER) bash -c "$(ROS_SETUP) && python3 /root/ros2_to_signalr_bridge.py"

.PHONY: sim foxglove nav2 initialpose bridge


