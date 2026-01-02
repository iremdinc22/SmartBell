namespace SmartBell.Api.Dtos.CheckOutDtos;

public class CheckOutRequestDto
{
    public string BookingCode { get; set; } = default!;
    public string Pin { get; set; } = default!;
}
