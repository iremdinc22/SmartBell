using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartBell.Api.Domain.Entities;

/// <summary>
/// Yüz tanıma verilerini (Embedding vektörü ve rezervasyon eşleşmesi) veritabanında tutan model.
/// </summary>
public class FaceRec
{
    /// <summary>
    /// Birincil Anahtar (Primary Key)
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Yüz verisinin ait olduğu rezervasyonun ID'si (Foreign Key)
    /// </summary>
    public Guid ReservationId { get; set; }

    /// <summary>
    /// Rezervasyon kodu. Veri araması için anahtar görevi görür.
    /// </summary>
    [Required]
    [MaxLength(50)] // Kod uzunluğuna göre ayarlayabilirsiniz
    public string BookingCode { get; set; } = string.Empty;

    /// <summary>
    /// Python mikroservisinden alınan yüzün Embedding Vektörünün JSON metin temsili.
    /// </summary>
    [Required]
    public string EmbeddingJson { get; set; } = string.Empty; 

    /// <summary>
    /// Kaydın oluşturulma/güncellenme tarihi.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // --- Navigasyon Özelliği (İsteğe bağlı, ancak ilişki kurmak için gereklidir) ---
    // Eğer Reservation tablosu ile EF Core ilişkisi kurmak istiyorsanız:
    // public virtual Reservation Reservation { get; set; } = null!;
}