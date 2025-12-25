namespace SmartBell.Api.Dtos.RobotDtos;

public class RobotPoseDto
{
    public string Id { get; set; } = default!;
    public double X { get; set; }        // meters
    public double Y { get; set; }        // meters
    public double Theta { get; set; }    // radians
    public int Battery { get; set; }
    public string Status { get; set; } = "Online";
}
