using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

public class CreateEmbeddingDtos
{
    [Required]
    public Guid ReservationId { get; set; }

    [Required]
    public string BookingCode { get; set; }

    [Required]                 // zorunlu alan
    public IFormFile File { get; set; } // <--- burada olmalı
    
    //public string TestField { get; set; }
}
