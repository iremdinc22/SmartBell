using SmartBell.Api.Domain.Enums;

namespace SmartBell.Api.Domain.Entities
{
    public class ReservationStatus
    {


        // Reservation tablosu Guid ise burası da Guid olmalı
        public Guid ReservationId { get; set; }
        public Reservation Reservation { get; set; } = default!;
        public string BookingCode { get; set; } = default!;
        public ReservationStayStatus Status { get; set; } = ReservationStayStatus.Reserved;

        public DateTime CheckInAllowedAt { get; set; }
        public DateTime CheckOutAllowedAt { get; set; }

        public DateTime? CheckedInAt { get; set; }
        public DateTime? CheckedOutAt { get; set; }

        // Check-in sonrası üretilecek -> nullable yap
        public string? PinHash { get; set; }
        public string? PinSalt { get; set; }
        public DateTime? PinCreatedAt { get; set; }
        public DateTime? PinValidUntil { get; set; }

    }
}
