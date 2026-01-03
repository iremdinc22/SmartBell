using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.CheckInDtos;
using SmartBell.Api.Services.Interfaces;
using System.Net.Http;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckInController : ControllerBase
{
    private readonly ICheckInService _checkInService;

    public CheckInController(ICheckInService checkInService)
    {
        _checkInService = checkInService;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CheckIn([FromForm] CheckInRequestDto request)
    {
        // FaceVerifController’daki aynı kontrol: gerekli
        if (request.File == null || request.File.Length == 0)
            return BadRequest(new { error = "Live image is required for check-in." });

        if (string.IsNullOrWhiteSpace(request.BookingCode))
            return BadRequest(new { error = "BookingCode is required." });

        try
        {
            var result = await _checkInService.CheckInAsync(request);
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            // Face microservice unreachable
            return StatusCode(503, new { error = "Face Microservice Unreachable or Failed.", detail = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // check-in zamanı değil, zaten checked-in, vs.
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Check-in failed.", detail = ex.Message });
        }
    }
}
