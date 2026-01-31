using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace SmartBell.Api.Domain.Entities;
public class Feedback
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public int Rating { get; set; }              // 1..5
    public string Tags { get; set; } = "[]";     // JSON string
    public string? Other { get; set; }
    public string? Comment { get; set; }
    public string StayAgain { get; set; } = "Yes"; // "Yes" | "Maybe" | "No"

    public string? RoomPin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


