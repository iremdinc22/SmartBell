using System.ComponentModel.DataAnnotations;

namespace SmartBell.Api.Dtos.ReservationDtos;

public class UpdateReservationStatusDto
{
    [Required]
    public Guid Id { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Confirmed"; // örn: Confirmed, Cancelled
}

