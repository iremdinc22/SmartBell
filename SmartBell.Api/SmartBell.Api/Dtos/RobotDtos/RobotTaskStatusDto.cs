namespace SmartBell.Api.Dtos.RobotDtos;

public class RobotTaskStatusDto
{
    public string RobotId { get; set; } = "robot_1";
    public string State { get; set; } = default!; // "IDLE","GOING","SUCCEEDED","FAILED","CANCELED","BUSY"
    public string? Target { get; set; }           // "room_14" gibi
    public string? Message { get; set; }          // hata açıklaması vb.
    public DateTimeOffset Ts { get; set; } = DateTimeOffset.UtcNow;
}

