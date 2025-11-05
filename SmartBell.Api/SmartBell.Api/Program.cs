using Microsoft.EntityFrameworkCore;
using SmartBell.Api;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Hubs;
using SmartBell.Api.Mapping;
using SmartBell.Api.Services.Implementations;
using SmartBell.Api.Services.Interfaces; // AutoMapper profili

var builder = WebApplication.CreateBuilder(args);

// 1) DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2) AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// 3) Repository & Service katmanları (senin extension)
builder.Services.AddProjectServices();

// 4) (Opsiyonel) Eğer AddProjectServices() içinde yoksa bu scoped kayıtları aç:
////builder.Services.AddScoped<IRobotService, RobotService>();
//// builder.Services.AddScoped<IRoomService, RoomService>();
//// builder.Services.AddScoped<IReservationService, ReservationService>();

// 5) SignalR servisleri
builder.Services.AddSignalR();

// 6) CORS (Vite/React ve SignalR için gerekli)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("client", p => p
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// 7) MVC & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 8) Dev Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 9) Middleware sırası
app.UseHttpsRedirection();
app.UseCors("client");

// 10) Routes
app.MapControllers();

// 11) SignalR Hub endpoint’i (frontend URL’ini buna göre ayarla)
app.MapHub<RobotHub>("/hubs/robot");

// 12) Run
app.Run();