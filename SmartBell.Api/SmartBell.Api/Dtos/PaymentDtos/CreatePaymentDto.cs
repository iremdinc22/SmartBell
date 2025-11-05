using System.ComponentModel.DataAnnotations;

namespace SmartBell.Api.Dtos.PaymentDtos;

public class CreatePaymentDto
{
    [Required] 
    public Guid ReservationId { get; set; }

    [Required, Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    [MaxLength(8)] 
    public string Currency { get; set; } = "EUR";
}