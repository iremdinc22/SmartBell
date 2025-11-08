using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Services.Interfaces; // IFaceService için
using System.Net.Http; // HttpRequestException için

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // URL: /api/Face
public class FaceVerifController : ControllerBase
{
    private readonly IFaceService _faceService;
    // [TODO: IReservationService'i de enjekte edin]

    public FaceVerifController(IFaceService faceService)
    {
        _faceService = faceService;
    }

    // URL: POST /api/Face/enroll
    /// <summary>
    /// Misafir rezervasyonu sırasında yüklenen fotoğrafı alır, embedding'i çıkarır ve DB'ye kaydeder.
    /// </summary>
    /// <param name="reservationId">Kaydı yapılacak rezervasyonun benzersiz ID'si.</param>
    /// <param name="bookingCode">Rezervasyon kodu (DB kaydının anahtarı).</param>
    /// <param name="file">Yüzü içeren fotoğraf dosyası.</param>
    [HttpPost("enroll")]
    [Consumes("multipart/form-data")] // Swagger/Scalar için bu önemlidir
    public async Task<IActionResult> EnrollReservationFace(
        [FromForm] Guid reservationId, 
        [FromForm] string bookingCode, 
        [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0) 
        {
            return BadRequest(new { error = "Image file is required for enrollment." });
        }

        // [TODO: Gerçek Reservation/BookingCode kontrolünü burada yapın]
        
        try
        {
            using (var stream = file.OpenReadStream())
            {
                // FaceService'i çağırır: Python'dan embedding'i çeker ve DB'ye BookingCode ile kaydeder.
                bool success = await _faceService.EnrollAndSaveFaceAsync(
                    reservationId, 
                    bookingCode,
                    stream, 
                    file.FileName);

                if (!success) 
                {
                    return BadRequest(new { error = "Enrollment failed on the service layer." });
                }

                return Ok(new { 
                    message = $"Enrollment successful for Booking Code: {bookingCode}."
                });
            }
        }
        catch (HttpRequestException ex)
        {
            // Python Microservice'ten gelen detaylı hatayı döndürür
            return StatusCode(503, new { 
                error = "Face Microservice Unreachable or Failed.", 
                detail = ex.Message 
            }); 
        }
        catch (Exception ex)
        {
            // Yüz tespit edilemedi vb. hatalar
            return BadRequest(new { error = "Enrollment failed.", detail = ex.Message });
        }
    }


    // URL: POST /api/Face/verify
    /// <summary>
    /// Misafir Check-in sırasında canlı görüntüyü alır ve kimlik doğrulaması yapar.
    /// </summary>
    /// <param name="bookingCode">Doğrulanacak rezervasyon kodu.</param>
    /// <param name="file">Canlı kamera görüntüsü dosyası.</param>
    [HttpPost("verify")]
    [Consumes("multipart/form-data")] // Swagger/Scalar için bu önemlidir
    public async Task<IActionResult> VerifyCheckin(
        [FromForm] string bookingCode,
        [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "Live image is required for verification." });
        }

        // [TODO: Rezervasyonun Check-in zamanı/durumu gibi kontrolleri burada yapın]
        
        try
        {
            using (var stream = file.OpenReadStream())
            {
                var (isVerified, score, status) = await _faceService.VerifyFaceAsync(
                    bookingCode, 
                    stream, 
                    file.FileName);

                if (isVerified)
                {
                    return Ok(new {
                        status = "Verified",
                        message = "Check-in successful. Door unlocked.",
                        score = score
                    });
                }
                else
                {
                    // 401 Unauthorized dönmek daha uygun, kullanıcıya detay vermeyiz
                    return Unauthorized(new {
                        status = "NotVerified",
                        message = "Identity verification failed.",
                        detail = $"Score below threshold ({score}). Status: {status}" 
                    }); 
                }
            }
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { 
                error = "Face Microservice Unreachable or Failed.", 
                detail = ex.Message 
            }); 
        }
        catch (Exception ex) when (ex.Message.Contains("No enrolled face"))
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            // Yüz tespit edilemedi vb. hatalar
            return BadRequest(new { error = "Verification failed.", detail = ex.Message });
        }
    }
}