using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos;
using SmartBell.Api.Services.Account;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
        => _accountService = accountService;

    [HttpGet("summary")]
    public async Task<ActionResult<AccountSummaryDto>> GetSummary(
        [FromQuery] string email,
        [FromQuery] string bookingCode)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(bookingCode))
            return BadRequest("email and bookingCode are required.");

        try
        {
            return Ok(await _accountService.GetSummaryAsync(email, bookingCode));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("personal-info")]
    public async Task<ActionResult<PersonalInfoDto>> UpdatePersonalInfo(
        [FromQuery] string email,
        [FromQuery] string bookingCode,
        [FromBody] UpdatePersonalInfoRequest req)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(bookingCode))
            return BadRequest("email and bookingCode are required.");

        try
        {
            return Ok(await _accountService.UpdatePersonalInfoAsync(email, bookingCode, req));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<List<BookingCardDto>>> GetBookings(
        [FromQuery] string email,
        [FromQuery] string bookingCode,
        [FromQuery] string type = "upcoming")
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(bookingCode))
            return BadRequest("email and bookingCode are required.");

        try
        {
            return Ok(await _accountService.GetBookingsAsync(email, bookingCode, type));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
