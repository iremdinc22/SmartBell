using SmartBell.Api.Dtos.ReservationDtos;
using SmartBell.Api.Dtos.FaceDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IReservationService
{
    Task<EnrollDto> CreateAsync(CreateReservationDto dto);
    Task<ReservationDto?> GetAsync(Guid id);
    Task<List<ReservationDto>> GetAllAsync();
    Task<bool> UpdateStatusAsync(UpdateReservationStatusDto dto);
}