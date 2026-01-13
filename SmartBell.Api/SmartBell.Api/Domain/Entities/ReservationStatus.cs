using System.ComponentModel.DataAnnotations;
using SmartBell.Api.Domain.Enums;

namespace SmartBell.Api.Domain.Entities;

public class ReservationStatus
{
    [Key] // 1-1 primary key
    public Guid ReservationId { get; set; }

    public Reservation Reservation { get; set; } = default!;

    [Required, MaxLength(12)]
    public string BookingCode { get; set; } = default!;

    public ReservationStayStatus Status { get; set; } = ReservationStayStatus.Reserved;

    public DateTime CheckInAllowedAt { get; set; }
    public DateTime CheckOutAllowedAt { get; set; }

    public DateTime? CheckedInAt { get; set; }
    public DateTime? CheckedOutAt { get; set; }

    public string? PinHash { get; set; }
    public string? PinSalt { get; set; }
    public DateTime? PinCreatedAt { get; set; }
    public DateTime? PinValidUntil { get; set; }
}
