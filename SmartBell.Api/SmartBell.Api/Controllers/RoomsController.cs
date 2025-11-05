using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Api.Dtos.RoomDtos;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    // GET /api/rooms
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var values = await _roomService.GetAllAsync();
        return Ok(values);
    }

    // GET /api/rooms/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var value = await _roomService.GetByIdAsync(id);
        if (value == null)
            return NotFound("Room not found.");
        return Ok(value);
    }

    // POST /api/rooms
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRoomDto dto)
    {
        var id = await _roomService.CreateAsync(dto);
        return Ok("Room created successfully.");
    }

    // PUT /api/rooms
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateRoomDto dto)
    {
        var updated = await _roomService.UpdateAsync(dto);
        if (!updated)
            return NotFound("Room not found.");
        return Ok("Room updated successfully.");
    }

    // DELETE /api/rooms/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _roomService.DeleteAsync(id);
        if (!deleted)
            return NotFound("Room not found.");
        return Ok("Room deleted successfully.");
    }

    // GET /api/rooms/suggest
    [HttpGet("suggest")]
    public async Task<IActionResult> Suggest(
        DateOnly checkIn,
        DateOnly checkOut,
        int adults = 2,
        int childrenUnder12 = 0,
        RoomPreference? preference = null,
        Amenity amenities = Amenity.None)
    {
        var suggestions = await _roomService.SuggestAsync(checkIn, checkOut, adults, childrenUnder12, preference, amenities);
        return Ok("Rooms suggested successfully.");
    }
}
