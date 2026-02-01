using System.Diagnostics;
using System.Net.Sockets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SmartBell.Api.Services.Services;

public class FaceApiStarterService : BackgroundService
{
    private readonly ILogger<FaceApiStarterService> _logger;
    private readonly IConfiguration _config;

    public FaceApiStarterService(
        ILogger<FaceApiStarterService> logger,
        IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var workingDir = _config["FaceApi:WorkingDirectory"];
        var port = _config.GetValue<int>("FaceApi:Port");

        // Config eksikse güvenli şekilde çık
        if (string.IsNullOrWhiteSpace(workingDir) || port == 0)
        {
            _logger.LogWarning("FaceApi config missing. Skipping Face API auto-start.");
            return Task.CompletedTask;
        }

        // Zaten çalışıyorsa tekrar başlatma
        if (IsPortOpen("127.0.0.1", port))
        {
            _logger.LogInformation("Face API already running on port {Port}. Skipping start.", port);
            return Task.CompletedTask;
        }

        var psi = new ProcessStartInfo
        {
            FileName = "bash",
            Arguments = $"-c \"source venv/bin/activate && python -m uvicorn main:app --host 0.0.0.0 --port {port}\"",
            WorkingDirectory = workingDir,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        Process.Start(psi);
        _logger.LogInformation("Face API started at port {Port}. WorkingDir={WorkingDir}", port, workingDir);

        return Task.CompletedTask;
    }

    private static bool IsPortOpen(string host, int port)
    {
        try
        {
            using var client = new TcpClient();
            client.Connect(host, port);
            return true;
        }
        catch
        {
            return false;
        }
    }
}


