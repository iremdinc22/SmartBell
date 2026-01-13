using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SmartBell.Api.Domain.Entities;

public class Reservation
{
    [Key] 
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required] public DateOnly CheckIn { get; set; }
    [Required] public DateOnly CheckOut { get; set; }

    [Range(1, 10)] public int Adults { get; set; } = 2;
    [Range(0, 10)] public int ChildrenUnder12 { get; set; } = 0;

    [MaxLength(40)] 
    public string RoomPreference { get; set; } = "Any"; // örn: Any, Deluxe, Suite
    
    [Required, MaxLength(120)] 
    public string FullName { get; set; } = null!;

    [MaxLength(160), EmailAddress] 
    public string? Email { get; set; }

    [Required, MaxLength(32)] 
    public string Phone { get; set; } = null!;

    [MaxLength(40)] 
    public string? RoomTypeSnapshot { get; set; } ="Any";
    
    [Precision(18, 2)] 
    public decimal? Total { get; set; }

    [MaxLength(8)] 
    public string Currency { get; set; } = "EUR";

    // --- Rezervasyon durumu ---
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
    public ReservationStatus? ReservationStatus { get; set; }

    [Required, MaxLength(12)] 
    public string BookingCode { get; set; } //= GenerateBookingCode();

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    // --- Navigation ---
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [NotMapped] 
    public int Nights => Math.Max(0, CheckOut.DayNumber - CheckIn.DayNumber);

    //bu kısmı reservation service e taşıdım
    
    // private static string GenerateBookingCode()
    //     => Convert.ToHexString(Guid.NewGuid().ToByteArray()[..4]).ToUpperInvariant();
}


