namespace SmartBell.Api.Dtos.RobotDtos;

public class RobotTaskCommandDto
{
    public string Type { get; set; } = default!; // "GO_TO_ROOM", "CANCEL_TASK" vs.
    public string? RobotId { get; set; }         // opsiyonel: tek robot değilse
    public int? RoomNumber { get; set; }         // örn 14
    public string? WaypointKey { get; set; }     // örn "room_14" (istersen backend üretir)
    public object? Payload { get; set; }         // genişletmek istersen
}


