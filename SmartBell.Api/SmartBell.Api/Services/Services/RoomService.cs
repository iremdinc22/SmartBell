using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.RoomDtos;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Services.Services;

public class RoomService : IRoomService
{
    private readonly IGenericRepository<Room> _repo;
    private readonly IMapper _mapper;

    public RoomService(IGenericRepository<Room> repo, IMapper mapper)
        => (_repo, _mapper) = (repo, mapper);

    public async Task<List<RoomDto>> GetAllAsync()
        => await _repo.Query().AsNoTracking()
            .ProjectTo<RoomDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<RoomDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity is null ? null : _mapper.Map<RoomDto>(entity);
    }

    public async Task<Guid> CreateAsync(CreateRoomDto dto)
    {
        var entity = _mapper.Map<Room>(dto);
        entity.Id = Guid.NewGuid();
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<bool> UpdateAsync(UpdateRoomDto dto)
    {
        var entity = await _repo.GetByIdAsync(dto.Id);
        if (entity is null) return false;
        _mapper.Map(dto, entity);
        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null) return false;
        _repo.Remove(entity);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<List<RoomDto>> SuggestAsync(
        DateOnly checkIn, DateOnly checkOut,
        int adults, int childrenUnder12,
        RoomPreference? preference = null,
        Amenity wanted = Amenity.None)
    {
        var people = adults + childrenUnder12;

        var q = _repo.Query()
            .Where(r => r.Status == "Active" && r.Capacity >= people);

        if (preference is not null && preference != RoomPreference.Any)
            q = q.Where(r => r.Preference == preference);

        if (wanted != Amenity.None)
            q = q.Where(r => (r.Amenities & wanted) == wanted);

        return await q
            .OrderBy(r => r.BasePricePerNight)
            .ProjectTo<RoomDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}