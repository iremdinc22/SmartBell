using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public InquiriesController(AppDbContext db)
    {
        _db = db;
    }

    // Public: form submit
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInquiryDto dto)
    {
        // MVP validation (çok basic)
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest("Email and message are required.");

        var entity = new Inquiry
        {
            Name = dto.Name?.Trim() ?? "",
            Email = dto.Email.Trim(),
            Subject = dto.Subject?.Trim() ?? "",
            Message = dto.Message.Trim()
        };

        _db.Inquiries.Add(entity);
        await _db.SaveChangesAsync();

        return Ok(new { entity.Id });
    }

    // Admin: listele
    [HttpGet]
    public async Task<IActionResult> AdminList()
    {
        var list = await _db.Inquiries
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(list);
    }
}



