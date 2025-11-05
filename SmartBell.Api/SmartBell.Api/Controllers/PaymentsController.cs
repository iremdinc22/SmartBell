using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartBell.Api.Dtos.PaymentDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        // GET /api/payments/reservation/{reservationId}
        [HttpGet("reservation/{reservationId:guid}")]
        public async Task<IActionResult> GetByReservation(Guid reservationId)
        {
            var value =await _service.GetByReservationAsync(reservationId);
            return Ok(value);
        }

        // POST /api/payments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok("Payment created successfully.");
        }

        // PUT /api/payments/status
        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdatePaymentStatusDto dto)
        {
            var ok = await _service.UpdateStatusAsync(dto);
            if (!ok)
                return NotFound("Payment not found.");
            return Ok("Payment status updated successfully.");
        }
    }
}
