using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Services.Interfaces; // IFaceService için
using System.Net.Http; // HttpRequestException için
using SmartBell.Api.Dtos.FaceDtos; // DTO'lar için

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // URL: /api/FaceVerif
public class FaceVerifController : ControllerBase
{
    private readonly IFaceService _faceService;              //create a face service field
    // [TODO: IReservationService'i de enjekte edin]

    public FaceVerifController(IFaceService faceService)     //constructor 
    {
        _faceService = faceService;
    }

    // URL: POST /api/FaceVerif/enroll

    [HttpPost("enroll")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> EnrollReservationFace(
        [FromForm] CreateEmbeddingDtos request)
    {
        if (request.File == null || request.File.Length == 0)         // if file is null or empty give error
            return BadRequest(new { error = "Image file is required for enrollment." });
        
        try
        {
            using var stream = request.File.OpenReadStream();         //get the image file from embedding DTO as stream
            bool success = await _faceService.EnrollAndSaveFaceAsync(
                request.ReservationId,                                //assign parameters from DTO to service method
                request.BookingCode,
                stream,
                request.File.FileName);

            if (!success)
                return BadRequest(new { error = "Enrollment failed on the service layer." });

            return Ok(new { message = $"Enrollment successful for Booking Code: {request.BookingCode}." });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { error = "Face Microservice Unreachable or Failed.", detail = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Enrollment failed.", detail = ex.Message });
        }
    }


    // URL: POST /api/FaceVerif/verify

    [HttpPost("verify")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> VerifyCheckin([FromForm] CheckInDtos request)
    {
        if (request.File == null || request.File.Length == 0)          // if file is null or empty give error
            return BadRequest(new { error = "Live image is required for verification." });

        try
        {
            using var stream = request.File.OpenReadStream();         //get the image file from embedding DTO as stream
            var (isVerified, score, status) = await _faceService.VerifyFaceAsync(
                request.BookingCode,                                  //assign parameters from DTO to service method
                stream,
                request.File.FileName);

            if (isVerified)
                return Ok(new { status = "Verified", message = "Check-in successful. Door unlocked.", score });
            else
                return Unauthorized(new { status = "NotVerified", message = "Identity verification failed.", detail = $"Score below threshold ({score}). Status: {status}" });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { error = "Face Microservice Unreachable or Failed.", detail = ex.Message });
        }
        catch (Exception ex) when (ex.Message.Contains("No enrolled face"))
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Verification failed.", detail = ex.Message });
        }
    }

}