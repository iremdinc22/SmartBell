using SmartBell.Api.Dtos.ReservationDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IReservationService
{
    Task<Guid> CreateAsync(CreateReservationDto dto);
    Task<ReservationDto?> GetAsync(Guid id);
    Task<List<ReservationDto>> GetAllAsync();
    Task<bool> UpdateStatusAsync(UpdateReservationStatusDto dto);
}