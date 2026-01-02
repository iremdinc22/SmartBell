namespace SmartBell.Api.Dtos.CheckOutDtos;

public class CheckOutResultDto
{
    public string BookingCode { get; set; } = default!;
    public DateTime CheckedOutAtUtc { get; set; }
    public string Message { get; set; } = default!;
    public bool RequiresFrontDesk { get; set; }
    
}
