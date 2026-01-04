using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Domain.Enums;
using SmartBell.Api.Dtos.CheckOutDtos;
using SmartBell.Api.Services.Interfaces;
using System.Security.Cryptography;

namespace SmartBell.Api.Services.Services;

public class CheckOutService : ICheckOutService
{
    private readonly AppDbContext _db;

    public CheckOutService(AppDbContext db) => _db = db;

    public async Task<CheckOutResultDto> CheckOutAsync(CheckOutRequestDto dto)
    {
        var bookingCode = dto.BookingCode.Trim().ToUpperInvariant();
        var pin = dto.Pin.Trim();

        // 1) Reservation bul
        var reservation = await _db.Reservations
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.BookingCode == bookingCode);

        if (reservation is null)
            throw new KeyNotFoundException($"Reservation not found for booking code: {bookingCode}");

        // 2) Status bul
        var status = await _db.Set<ReservationStatus>()
            .FirstOrDefaultAsync(s => s.ReservationId == reservation.Id);

        if (status is null)
            throw new InvalidOperationException("ReservationStatus record is missing for this reservation.");

        // 3) Kural kontrolleri
        var nowUtc = DateTime.UtcNow;

        if (status.CheckedInAt is null)
            throw new InvalidOperationException("Cannot check-out before check-in.");

        if (status.CheckedOutAt is not null)
            throw new InvalidOperationException("This reservation is already checked-out.");

        // 5) PIN doğrula
        if (string.IsNullOrWhiteSpace(status.PinHash) || string.IsNullOrWhiteSpace(status.PinSalt))
            throw new InvalidOperationException("Room PIN is not generated yet.");

        if (!VerifyPin(pin, status.PinHash!, status.PinSalt!))
            throw new UnauthorizedAccessException("Invalid PIN.");

        // 6) Checkout tamamla
        status.CheckedOutAt = nowUtc;
        if (nowUtc > status.CheckOutAllowedAt)
            status.Status = ReservationStayStatus.LateCheckOut;
        else
            status.Status = ReservationStayStatus.CheckedOut;

        // İstersen PIN’i iptal etmek için:
        // status.PinValidUntil = nowUtc;

        await _db.SaveChangesAsync();

        return new CheckOutResultDto
        {
            BookingCode = bookingCode,
            CheckedOutAtUtc = nowUtc,
            RequiresFrontDesk = false,
            Message = "Check-out successful."
        };
    }

    private static bool VerifyPin(string pin, string storedHashBase64, string storedSaltBase64)
    {
        var saltBytes = Convert.FromBase64String(storedSaltBase64);
        using var pbkdf2 = new Rfc2898DeriveBytes(pin, saltBytes, 100_000, HashAlgorithmName.SHA256);
        var computedHash = pbkdf2.GetBytes(32);
        var storedHash = Convert.FromBase64String(storedHashBase64);

        return CryptographicOperations.FixedTimeEquals(computedHash, storedHash);
    }
}
