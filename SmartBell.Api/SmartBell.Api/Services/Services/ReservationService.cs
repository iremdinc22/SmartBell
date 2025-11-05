using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.ReservationDtos;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Services.Services;

public class ReservationService : IReservationService
{
    private readonly AppDbContext _db;
    private readonly IGenericRepository<Reservation> _repo;
    private readonly IMapper _mapper;

    public ReservationService(AppDbContext db, IGenericRepository<Reservation> repo, IMapper mapper)
        => (_db, _repo, _mapper) = (db, repo, mapper);

    public async Task<Guid> CreateAsync(CreateReservationDto dto)
    {
        var people = dto.Adults + dto.ChildrenUnder12;

        var roomsQ = _db.Rooms.AsQueryable()
            .Where(r => r.Status == "Active" && r.Capacity >= people);

        RoomPreference? prefEnum = Enum.TryParse<RoomPreference>(dto.RoomPreference, out var pref) ? pref : null;
        if (prefEnum is not null && prefEnum != RoomPreference.Any)
            roomsQ = roomsQ.Where(r => r.Preference == prefEnum);

        var selectedRoom = await roomsQ.OrderBy(r => r.BasePricePerNight).FirstOrDefaultAsync();

        var entity = _mapper.Map<Reservation>(dto);
        entity.Id = Guid.NewGuid();
        entity.RoomTypeSnapshot = selectedRoom?.Type ?? dto.RoomPreference;

        var nights = Math.Max(0, dto.CheckOut.DayNumber - dto.CheckIn.DayNumber);
        var pricePerNight = selectedRoom?.BasePricePerNight ?? 100m;
        entity.Total = pricePerNight * (nights == 0 ? 1 : nights);

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<ReservationDto?> GetAsync(Guid id)
        => await _repo.Query()
            .Where(r => r.Id == id)
            .ProjectTo<ReservationDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

    public async Task<List<ReservationDto>> GetAllAsync()
        => await _repo.Query().AsNoTracking()
            .OrderByDescending(r => r.CreatedAtUtc)
            .ProjectTo<ReservationDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> UpdateStatusAsync(UpdateReservationStatusDto dto)
    {
        var entity = await _repo.GetByIdAsync(dto.Id);
        if (entity is null) return false;
        entity.Status = dto.Status;
        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return true;
    }
}