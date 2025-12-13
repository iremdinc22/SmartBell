using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.ReservationDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers
{
    [ApiController]
    [Route("api/reservations")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _service;

        public ReservationsController(IReservationService service)
        {
            _service = service;
        }

        // GET /api/reservations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
           var values =  await _service.GetAllAsync();
            return Ok(values);
        }

        // GET /api/reservations/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var res = await _service.GetAsync(id);
            if (res is null)
                return NotFound("Reservation not found.");
            return Ok(res);
        }

        // POST /api/reservations
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var enrollData = await _service.CreateAsync(dto);
            return Ok(enrollData);
        }

        // PUT /api/reservations/status
        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateReservationStatusDto dto)
        {
            var ok = await _service.UpdateStatusAsync(dto);
            if (!ok)
                return NotFound("Reservation not found.");
            return Ok("Reservation status updated successfully.");
        }
    }

}
