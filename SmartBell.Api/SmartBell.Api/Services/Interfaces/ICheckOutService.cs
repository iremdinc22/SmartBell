using SmartBell.Api.Dtos.CheckOutDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface ICheckOutService
{
    Task<CheckOutResultDto> CheckOutAsync(CheckOutRequestDto dto);
}
