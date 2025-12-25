using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Domain.Entities;

public class Room
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required, MaxLength(16)]
    public string Code { get; set; } = null!; // örn: D405

    [Required, MaxLength(40)]
    public string Type { get; set; } = "Any"; 

    [Range(1, 10)]
    public int Capacity { get; set; }

    [Precision(18,2)]
    public decimal BasePricePerNight { get; set; } = 100;
    
    [Required]
    public RoomPreference Preference { get; set; } = RoomPreference.Any;
    
    // Öneri için kritik alan:
    public Amenity Amenities { get; set; } = Amenity.None;

    [MaxLength(20)]
    public string Status { get; set; } = "Active"; 

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}