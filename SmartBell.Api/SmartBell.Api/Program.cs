using Microsoft.EntityFrameworkCore;
using SmartBell.Api;
using SmartBell.Api.Data.DbContext;
using SmartBell.Api.Hubs;
using SmartBell.Api.Mapping;
using SmartBell.Api.Services.Implementations.Robot;
using SmartBell.Api.Services.Interfaces; // AutoMapper profili
using SmartBell.Api.Services.Services;
using SmartBell.Api.Services.Services.Robot;
using SmartBell.Api.Integrations; // FaceVerificationClient'ın yeni konumu
using SmartBell.Api.Swagger;
using SmartBell.Api.Infrastructure.Email;
using SmartBell.Api.Options;
using Microsoft.AspNetCore.StaticFiles;
using SmartBell.Api.Recommendation;
using SmartBell.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// 1) DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ✅ Mail config DI
builder.Services.Configure<MailSettings>(
    builder.Configuration.GetSection("Mail")
);

// 2) AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// 3) Repository & Service katmanları (senin extension)
builder.Services.AddProjectServices();

// ✅ Recommendation config + engine + service DI (EKLENDİ)
builder.Services.Configure<RecommendationOptions>(
    builder.Configuration.GetSection("Recommendation"));
builder.Services.AddSingleton<RecommendationEngine>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();

// 4) (Opsiyonel) Eğer AddProjectServices() içinde yoksa bu scoped kayıtları aç:
////builder.Services.AddScoped<IRobotService, RobotService>();
//// builder.Services.AddScoped<IRoomService, RoomService>();
//// builder.Services.AddScoped<IReservationService, ReservationService>();
// a) Python Microservice için HttpClient kaydı
builder.Services.AddHttpClient<FaceVerificationClient>(); 
builder.Services.AddSingleton<IEmailQueue, EmailQueue>();
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();
builder.Services.AddHostedService<EmailWorker>();
builder.Services.AddHostedService<MapPgmToPngWorker>();

// NEW: Face API başlatma servisi backendle
builder.Services.AddHostedService<FaceApiStarterService>();

builder.Services.AddSingleton<IRobotPoseStore, RobotPoseStore>();

//  NEW: Robot command gateway (Backend -> SignalR -> Python Bridge)
builder.Services.AddSingleton<IRobotCommandGateway, SignalRRobotCommandGateway>();

//  NEW: Robot task status store (Robot -> Backend -> SignalR)
builder.Services.AddSingleton<IRobotTaskStatusStore, RobotTaskStatusStore>();


// b) Yüz İş Mantığı Servisi (IFaceService) kaydı
builder.Services.AddScoped<IFaceService, FaceService>(); 
// c) Check-In Servisi kaydı
builder.Services.AddScoped<ICheckInService, CheckInService>();
// d) Check-Out Servisi kaydı
builder.Services.AddScoped<ICheckOutService, CheckOutService>();


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
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "SmartBell API", Version = "v1" });
    c.OperationFilter<FileUploadOperationFilter>();
});

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "UP" }));


// 8) Dev Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 9) Middleware sırası
//app.UseHttpsRedirection();
//app.UseStaticFiles(); 

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".pgm"]  = "image/x-portable-graymap";
provider.Mappings[".yaml"] = "text/yaml";
provider.Mappings[".yml"]  = "text/yaml";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider,
    ServeUnknownFileTypes = true
});


app.UseCors("client");

// 10) Routes
app.MapControllers();
// Basit bir test sayfası için
app.MapGet("/", () => "SmartBell API çalışıyor! Bu bir geçici test sayfasıdır.");

// 11) SignalR Hub endpoint’i (frontend URL’ini buna göre ayarla)
app.MapHub<RobotHub>("/hubs/robot");

// 12) Run
app.Run();

