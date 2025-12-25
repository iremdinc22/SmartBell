using SmartBell.Api.Integrations; // FaceVerificationClient DTO'ları için (Integration klasöründen)
using System.IO;

namespace SmartBell.Api.Services.Interfaces;

/// <summary>
/// Yüz tanıma/doğrulama işlemlerinin ana iş mantığını tanımlar.
/// </summary>
public interface IFaceService
{
    /// <summary>
    /// Misafir fotoğrafını alır, embedding'i çıkarır ve rezervasyonla eşleştirerek DB'ye kaydeder.
    /// </summary>
    /// <param name="reservationId">Rezervasyonun GUID'si.</param>
    /// <param name="bookingCode">Rezervasyonun kodu.</param>
    /// <param name="imageStream">Kaydedilecek fotoğrafın Stream'i.</param>
    /// <param name="fileName">Dosya adı.</param>
    /// <returns>Kayıt başarılıysa true.</returns>
    Task<bool> EnrollAndSaveFaceAsync(
        Guid reservationId, 
        string bookingCode,
        Stream imageStream, 
        string fileName
    );

    /// <summary>
    /// Check-in sırasında canlı görüntüyü alır, kayıtlı embedding ile karşılaştırarak kimlik doğrulaması yapar.
    /// </summary>
    /// <param name="bookingCode">Doğrulanacak rezervasyon kodu.</param>
    /// <param name="liveImageStream">Canlı kamera görüntüsünün Stream'i.</param>
    /// <param name="fileName">Dosya adı.</param>
    /// <returns>Doğrulama durumu, benzerlik skoru ve durum mesajını içeren tuple.</returns>
    Task<(bool IsVerified, double Score, string Status)> VerifyFaceAsync(
        string bookingCode, 
        Stream liveImageStream, 
        string fileName
    );
}