using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace SmartBell.Api.Domain.Entities;

public class Payment
{
    [Key] 
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required] 
    public Guid ReservationId { get; set; }
    public Reservation Reservation { get; set; } = null!;

    [Precision(18, 2)] 
    public decimal Amount { get; set; }

    [MaxLength(8)] 
    public string Currency { get; set; } = "EUR";

    [MaxLength(20)] 
    public string Status { get; set; } = "Initiated"; // örn: Initiated, Paid, Failed

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}