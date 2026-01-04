namespace SmartBell.Api.Dtos.CheckInDtos;

public class CheckInResultDto
{
    public string BookingCode { get; set; } = default!;
    public DateTime CheckedInAtUtc { get; set; }
    public string Message { get; set; } = default!;
}
