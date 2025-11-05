namespace SmartBell.Api.Dtos.PaymentDtos;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid ReservationId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string Status { get; set; } = "Initiated";
    public DateTime CreatedAtUtc { get; set; }
}