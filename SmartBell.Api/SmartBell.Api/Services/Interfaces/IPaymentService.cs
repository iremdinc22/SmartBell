using SmartBell.Api.Dtos.PaymentDtos;

namespace SmartBell.Api.Services.Interfaces;

public interface IPaymentService
{
    Task<Guid> CreateAsync(CreatePaymentDto dto);
    Task<bool> UpdateStatusAsync(UpdatePaymentStatusDto dto);
    Task<List<PaymentDto>> GetByReservationAsync(Guid reservationId);
}