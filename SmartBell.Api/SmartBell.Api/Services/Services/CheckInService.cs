using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.CheckInDtos;
using SmartBell.Api.Infrastructure.Email;
using SmartBell.Api.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace SmartBell.Api.Services.Services;

public class CheckInService : ICheckInService
{
    private readonly AppDbContext _db;
    private readonly IFaceService _faceService;
    private readonly IEmailQueue _emailQueue;

    public CheckInService(AppDbContext db, IFaceService faceService, IEmailQueue emailQueue)
        => (_db, _faceService, _emailQueue) = (db, faceService, emailQueue);

    public async Task<CheckInResultDto> CheckInAsync(CheckInRequestDto dto)
    {
        var bookingCode = dto.BookingCode.Trim();

        // 1) Reservation bul
        var reservation = await _db.Reservations
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.BookingCode == bookingCode);

        if (reservation is null)
            throw new KeyNotFoundException($"Reservation not found for booking code: {bookingCode}");

        // 2) ReservationStatus bul
        var status = await _db.Set<ReservationStatus>()
            .FirstOrDefaultAsync(s => s.ReservationId == reservation.Id);

        if (status is null)
            throw new InvalidOperationException("ReservationStatus record is missing for this reservation.");

        // 3) Zaman kontrolü (UTC kullan)
        var nowUtc = DateTime.UtcNow;

        if (nowUtc < status.CheckInAllowedAt)
        {
            // Kullanıcının anlayacağı yerel saate (UTC+3) geri çevirerek gösterelim
            var localTime = status.CheckInAllowedAt.AddHours(3); 
            throw new InvalidOperationException($"Check-in not allowed yet. Check-in time: {localTime:dd.MM.yyyy HH:mm}");
        }

        if (status.CheckedInAt is not null)
            throw new InvalidOperationException("This reservation is already checked-in.");

        if (status.CheckedOutAt is not null)
            throw new InvalidOperationException("This reservation is already checked-out.");

        // 4) Face verify
        using var stream = dto.File.OpenReadStream();
        var (isVerified, score, verifyStatus) = await _faceService.VerifyFaceAsync(
            bookingCode,
            stream,
            dto.File.FileName);

        if (!isVerified)
            throw new UnauthorizedAccessException($"Identity verification failed. Please get help from our desk.");

        // 5) PIN üret + hash/salt
        var pin = GeneratePin(4, 6);
        var (hash, salt) = HashPin(pin);

        status.PinHash = hash;
        status.PinSalt = salt;
        status.PinCreatedAt = nowUtc;
        status.PinValidUntil = status.CheckOutAllowedAt;

        // 6) Status güncelle
        status.CheckedInAt = nowUtc;
        status.Status = SmartBell.Api.Domain.Enums.ReservationStayStatus.CheckedIn;

        await _db.SaveChangesAsync();

        // 7) Mail (PIN içeren)
        if (!string.IsNullOrWhiteSpace(reservation.Email))
        {
            var subject = $"Zenith Suites | Room PIN (#{bookingCode})";
            var html = EmailTemplates.RoomPin(reservation, pin, status.PinValidUntil.Value);
            await _emailQueue.EnqueueAsync(new EmailJob(reservation.Email, subject, html));
        }

        return new CheckInResultDto
        {
            BookingCode = bookingCode,
            CheckedInAtUtc = nowUtc,
            Message = "Check-in successful. PIN has been sent by email."
        };
    }

    private static string GeneratePin(int minDigits, int maxDigits)
    {
        var len = RandomNumberGenerator.GetInt32(minDigits, maxDigits + 1);
        var sb = new StringBuilder(len);
        for (int i = 0; i < len; i++)
            sb.Append(RandomNumberGenerator.GetInt32(0, 10));
        return sb.ToString();
    }

    private static (string Hash, string Salt) HashPin(string pin)
    {
        // Basit ve yeterli: PBKDF2
        var saltBytes = RandomNumberGenerator.GetBytes(16);
        using var pbkdf2 = new Rfc2898DeriveBytes(pin, saltBytes, 100_000, HashAlgorithmName.SHA256);
        var hashBytes = pbkdf2.GetBytes(32);

        return (Convert.ToBase64String(hashBytes), Convert.ToBase64String(saltBytes));
    }
}
