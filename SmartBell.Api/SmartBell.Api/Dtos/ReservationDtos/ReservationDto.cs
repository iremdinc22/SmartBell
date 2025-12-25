using System;

namespace SmartBell.Api.Dtos.ReservationDtos
{
    public class ReservationDto
    {
        public Guid Id { get; set; }
        public string BookingCode { get; set; } = null!;
        public string Status { get; set; } = "Pending";

        public DateOnly CheckIn { get; set; }
        public DateOnly CheckOut { get; set; }

        public int Adults { get; set; }
        public int ChildrenUnder12 { get; set; }

        public string RoomPreference { get; set; } = "Any";
        public string? RoomTypeSnapshot { get; set; }

        public decimal? Total { get; set; }
        public string Currency { get; set; } = "EUR";

        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string Phone { get; set; } = null!;

        public DateTime CreatedAtUtc { get; set; }
        public int Nights { get; set; }
    }
}