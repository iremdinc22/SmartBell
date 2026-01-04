using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.ReservationDtos;
using SmartBell.Api.Dtos.FaceDtos;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Domain.Enums;
using SmartBell.Api.Domain.Enums;
using SmartBell.Api.Infrastructure.Email;


namespace SmartBell.Api.Services.Services;

public class ReservationService : IReservationService
{
    private readonly AppDbContext _db;
    private readonly IGenericRepository<Reservation> _repo;
    private readonly IMapper _mapper;
    private readonly IEmailQueue _emailQueue;

    public ReservationService(AppDbContext db, IGenericRepository<Reservation> repo, IMapper mapper, IEmailQueue emailQueue)
    => (_db, _repo, _mapper, _emailQueue) = (db, repo, mapper, emailQueue);

    public async Task<EnrollDto> CreateAsync(CreateReservationDto dto)
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

        //  BookingCode üretimi
        entity.BookingCode = await GenerateUniqueBookingCodeAsync();

        await _repo.AddAsync(entity);
        //await _repo.SaveChangesAsync();

        var timezoneId = OperatingSystem.IsWindows() ? "Turkey Standard Time" : "Europe/Istanbul";
        var turkeyZone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);

        var checkInLocal = dto.CheckIn.ToDateTime(new TimeOnly(14, 0));
        var checkInUtc = TimeZoneInfo.ConvertTimeToUtc(checkInLocal, turkeyZone);

        var checkOutLocal = dto.CheckOut.ToDateTime(new TimeOnly(12, 0));
        var checkOutUtc = TimeZoneInfo.ConvertTimeToUtc(checkOutLocal, turkeyZone);

        var status = new ReservationStatus
        {
            ReservationId = entity.Id,
            Status = ReservationStayStatus.Reserved,
            BookingCode = entity.BookingCode,

            CheckInAllowedAt = checkInUtc,
            CheckOutAllowedAt = checkOutUtc


        };

        _db.Set<ReservationStatus>().Add(status);

        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(entity.Email))
        {
            var subject = $"Zenith Suites | Reservation Confirmed (#{entity.BookingCode})";
            var html = EmailTemplates.ReservationConfirmed(entity);

            await _emailQueue.EnqueueAsync(new EmailJob(entity.Email, subject, html));
        }

        return new EnrollDto
        {
            Id = entity.Id,
            BookingCode = entity.BookingCode
        };
    }


    private async Task<string> GenerateUniqueBookingCodeAsync()
    {
        string code;
        bool exists;
        do
        {
            code = Convert.ToHexString(Guid.NewGuid().ToByteArray()[..4]).ToUpperInvariant();
            exists = await _repo.Query().AnyAsync(r => r.BookingCode == code);
        } while (exists);
        return code;
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