using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos;

namespace SmartBell.Api.Services.Account;

public class AccountService : IAccountService
{
    private readonly AppDbContext _db;

    public AccountService(AppDbContext db) => _db = db;

    public async Task<AccountSummaryDto> GetSummaryAsync(string email, string bookingCode)
    {
        Normalize(ref email, ref bookingCode);

        if (!await OwnsBookingAsync(email, bookingCode))
            throw new KeyNotFoundException("Reservation not found for this email/bookingCode.");

        var nowUtc = DateTime.UtcNow;
        var today = DateOnly.FromDateTime(nowUtc);

        var reservations = await _db.Reservations
            .Where(r => r.Email != null && r.Email.ToLower() == email)
            .Include(r => r.ReservationStatus)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync();

        var latest = reservations.FirstOrDefault();
        var (firstName, lastName) = SplitName(latest?.FullName ?? "");

        var personal = new PersonalInfoDto(
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: latest?.Phone ?? ""
        );

        var upcoming = reservations
            .Where(r => !IsCancelled(r) && !IsPast(r, today))
            .OrderBy(r => r.CheckIn)
            .Select(r => ToCard(r, nowUtc))
            .ToList();

        var past = reservations
            .Where(r => IsPast(r, today))
            .OrderByDescending(r => r.CheckIn)
            .Select(r => ToCard(r, nowUtc))
            .ToList();

        return new AccountSummaryDto(
            PersonalInfo: personal,
            UpcomingBookings: upcoming,
            PastBookings: past,
            PaymentMethods: new List<PaymentMethodDto>(),
            Stats: new AccountStatsDto(upcoming.Count, past.Count)
        );
    }

    public async Task<PersonalInfoDto> UpdatePersonalInfoAsync(
        string email,
        string bookingCode,
        UpdatePersonalInfoRequest req)
    {
        Normalize(ref email, ref bookingCode);

        if (!await OwnsBookingAsync(email, bookingCode))
            throw new KeyNotFoundException("Reservation not found for this email/bookingCode.");

        var latest = await _db.Reservations
            .Where(r => r.Email != null && r.Email.ToLower() == email)
            .OrderByDescending(r => r.CreatedAtUtc)
            .FirstOrDefaultAsync();

        if (latest == null)
            throw new KeyNotFoundException("No reservations for this email.");

        var fn = (req.FirstName ?? "").Trim();
        var ln = (req.LastName ?? "").Trim();
        var phone = (req.Phone ?? "").Trim();

        if (!string.IsNullOrWhiteSpace(fn) || !string.IsNullOrWhiteSpace(ln))
            latest.FullName = $"{fn} {ln}".Trim();

        if (!string.IsNullOrWhiteSpace(phone))
            latest.Phone = phone;

        await _db.SaveChangesAsync();

        var (firstName, lastName) = SplitName(latest.FullName);

        return new PersonalInfoDto(
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Phone: latest.Phone
        );
    }

    public async Task<List<BookingCardDto>> GetBookingsAsync(string email, string bookingCode, string type)
    {
        Normalize(ref email, ref bookingCode);

        if (!await OwnsBookingAsync(email, bookingCode))
            throw new KeyNotFoundException("Reservation not found for this email/bookingCode.");

        var nowUtc = DateTime.UtcNow;
        var today = DateOnly.FromDateTime(nowUtc);

        var reservations = await _db.Reservations
            .Where(r => r.Email != null && r.Email.ToLower() == email)
            .Include(r => r.ReservationStatus)
            .ToListAsync();

        var wantPast = string.Equals(type, "past", StringComparison.OrdinalIgnoreCase);

        var list = reservations
            .Where(r => wantPast ? IsPast(r, today) : (!IsCancelled(r) && !IsPast(r, today)))
            .OrderBy(r => r.CheckIn)
            .Select(r => ToCard(r, nowUtc))
            .ToList();

        if (wantPast) list.Reverse();
        return list;
    }

    // ---------------- helpers ----------------

    private static void Normalize(ref string email, ref string bookingCode)
    {
        email = (email ?? "").Trim().ToLowerInvariant();
        bookingCode = (bookingCode ?? "").Trim().ToUpperInvariant();
    }

    private async Task<bool> OwnsBookingAsync(string email, string bookingCode)
    {
        return await _db.Reservations.AnyAsync(r =>
            r.Email != null &&
            r.Email.ToLower() == email &&
            r.BookingCode.ToUpper() == bookingCode
        );
    }

    private static (string first, string last) SplitName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName)) return ("", "");
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 1) return (parts[0], "");
        return (parts[0], string.Join(" ", parts.Skip(1)));
    }

    private static bool IsCancelled(Reservation r)
        => string.Equals(r.Status, "Cancelled", StringComparison.OrdinalIgnoreCase);

    private static bool IsPast(Reservation r, DateOnly today)
    {
        if (r.ReservationStatus?.CheckedOutAt != null) return true;
        return r.CheckOut < today;
    }

    private static BookingCardDto ToCard(Reservation r, DateTime nowUtc)
    {
        var rs = r.ReservationStatus;

        var canCheckIn = rs != null && rs.CheckedInAt == null && nowUtc >= rs.CheckInAllowedAt;

        var canCheckOut = rs != null && rs.CheckedInAt != null && rs.CheckedOutAt == null && nowUtc >= rs.CheckOutAllowedAt;

        var roomTitle = !string.IsNullOrWhiteSpace(r.RoomTypeSnapshot) && r.RoomTypeSnapshot != "Any"
            ? r.RoomTypeSnapshot!
            : r.RoomPreference;

        var subtitle = $"{r.Nights} nights • {r.Adults} adults" +
                       (r.ChildrenUnder12 > 0 ? $" • {r.ChildrenUnder12} children" : "");

        return new BookingCardDto(
            BookingCode: r.BookingCode,
            CheckIn: r.CheckIn,
            CheckOut: r.CheckOut,
            Nights: r.Nights,
            Adults: r.Adults,
            ChildrenUnder12: r.ChildrenUnder12,
            RoomTitle: roomTitle,
            Subtitle: subtitle,
            StayStatus: rs?.Status.ToString() ?? "Unknown",
            CanCheckIn: canCheckIn,
            CanCheckOut: canCheckOut,
            CheckedInAt: rs?.CheckedInAt,
            CheckedOutAt: rs?.CheckedOutAt
        );
    }
}
