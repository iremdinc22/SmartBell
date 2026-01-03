using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.CheckOutDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckOutController : ControllerBase
{
    private readonly ICheckOutService _checkOutService;

    public CheckOutController(ICheckOutService checkOutService)
        => _checkOutService = checkOutService;

    [HttpPost]
    public async Task<IActionResult> CheckOut([FromBody] CheckOutRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.BookingCode))
            return BadRequest(new { error = "BookingCode is required." });

        if (string.IsNullOrWhiteSpace(request.Pin))
            return BadRequest(new { error = "PIN is required." });

        try
        {
            var result = await _checkOutService.CheckOutAsync(request);

            // ek ödeme varsa 200 döndürüp front desk mesajını UI’da gösterebilirsin
            return Ok(result);
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
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Check-out failed.", detail = ex.Message });
        }
    }
}
