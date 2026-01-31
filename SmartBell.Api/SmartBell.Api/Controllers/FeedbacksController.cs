using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class FeedbacksController : ControllerBase
{
    private readonly AppDbContext _db;

    public FeedbacksController(AppDbContext db)
    {
        _db = db;
    }

    // Public: feedback submit
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFeedbackDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        var entity = new Feedback
        {
            Rating = dto.Rating,
            Tags = JsonSerializer.Serialize(dto.Tags ?? new List<string>()),
            Other = dto.Other,
            Comment = dto.Comment,
            StayAgain = string.IsNullOrWhiteSpace(dto.StayAgain) ? "Yes" : dto.StayAgain,
            RoomPin = dto.RoomPin
        };

        _db.Feedbacks.Add(entity);
        await _db.SaveChangesAsync();

        return Ok(new { entity.Id });
    }

    // Admin: listele
    [HttpGet]
    public async Task<IActionResult> AdminList()
    {
        var list = await _db.Feedbacks
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(list);
    }
}


