using Microsoft.AspNetCore.Http;

namespace SmartBell.Api.Dtos.CheckInDtos;

public class CheckInRequestDto
{
    public string BookingCode { get; set; } = default!;
    public IFormFile File { get; set; } = default!;
}
