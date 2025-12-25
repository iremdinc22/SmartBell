using System.ComponentModel.DataAnnotations;

namespace SmartBell.Api.Dtos.ReservationDtos
{
    public class CreateReservationDto
    {
        [Required]
        public DateOnly CheckIn { get; set; }

        [Required]
        public DateOnly CheckOut { get; set; }

        [Range(1, 10)]
        public int Adults { get; set; } = 2;

        [Range(0, 10)]
        public int ChildrenUnder12 { get; set; } = 0;

        [MaxLength(40)]
        public string RoomPreference { get; set; } = "Any";

        // Müşteri bilgileri (ödeme ekranından gelir)
        [Required, MaxLength(120)]
        public string FullName { get; set; } = null!;

        [MaxLength(160), EmailAddress]
        public string? Email { get; set; }

        [Required, MaxLength(32)]
        public string Phone { get; set; } = null!;
    }
}