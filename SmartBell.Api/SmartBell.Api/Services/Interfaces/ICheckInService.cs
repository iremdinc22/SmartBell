using SmartBell.Api.Dtos.CheckInDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface ICheckInService
{
    Task<CheckInResultDto> CheckInAsync(CheckInRequestDto dto);
}
