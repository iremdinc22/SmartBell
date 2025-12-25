using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.PaymentDtos;
using SmartBell.Api.Services.Interfaces;

namespace SmartBell.Api.Services.Services;

public class PaymentService : IPaymentService
{
    private readonly IGenericRepository<Payment> _repo;
    private readonly IMapper _mapper;

    public PaymentService(IGenericRepository<Payment> repo, IMapper mapper)
        => (_repo, _mapper) = (repo, mapper);

    public async Task<Guid> CreateAsync(CreatePaymentDto dto)
    {
        var entity = _mapper.Map<Payment>(dto);
        entity.Id = Guid.NewGuid();
        entity.Status = "Initiated";
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<bool> UpdateStatusAsync(UpdatePaymentStatusDto dto)
    {
        var entity = await _repo.GetByIdAsync(dto.Id);
        if (entity is null) return false;
        entity.Status = dto.Status;
        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<List<PaymentDto>> GetByReservationAsync(Guid reservationId)
        => await _repo.Query()
            .Where(p => p.ReservationId == reservationId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ProjectTo<PaymentDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
}