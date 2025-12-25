using System.ComponentModel.DataAnnotations;

namespace SmartBell.Api.Dtos.PaymentDtos;

public class UpdatePaymentStatusDto
{
    [Required]
    public Guid Id { get; set; }  // Payment Id

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Paid"; // örn: Paid, Failed
}

// İyzico eklersek diye koydum