using SmartBell.Api.Data.Repositories;
using SmartBell.Api.Services.Account;
using SmartBell.Api.Services.Implementations;
using SmartBell.Api.Services.Interfaces;
using SmartBell.Api.Services.Services;

namespace SmartBell.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddProjectServices(this IServiceCollection services)
    {
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IRoomService, RoomService>();
        services.AddScoped<IReservationService, ReservationService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IRobotService, RobotService>();
        services.AddScoped<IAccountService, AccountService>();


        return services;
    }
}

