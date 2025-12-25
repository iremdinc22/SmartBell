using SmartBell.Api.Dtos.RoomDtos;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Services.Interfaces;

public interface IRoomService
{
    Task<List<RoomDto>> GetAllAsync();
    Task<RoomDto?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(CreateRoomDto dto);
    Task<bool> UpdateAsync(UpdateRoomDto dto);
    Task<bool> DeleteAsync(Guid id);

    // Öneri / uygun oda listesi
    Task<List<RoomDto>> SuggestAsync(
        DateOnly checkIn, DateOnly checkOut,
        int adults, int childrenUnder12,
        RoomPreference? preference = null,
        Amenity wanted = Amenity.None);
}