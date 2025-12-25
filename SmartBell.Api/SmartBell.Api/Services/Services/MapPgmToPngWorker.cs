using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using System.Text;

namespace SmartBell.Api.Services.Services;

public class MapPgmToPngWorker : BackgroundService
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<MapPgmToPngWorker> _logger;

    private FileSystemWatcher? _watcher;

    public MapPgmToPngWorker(IWebHostEnvironment env, ILogger<MapPgmToPngWorker> logger)
    {
        _env = env;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var mapsDir = Path.Combine(webRoot, "maps");
        Directory.CreateDirectory(mapsDir);

        var pgmPath = Path.Combine(mapsDir, "map.pgm");
        var pngPath = Path.Combine(mapsDir, "map.png");

        // Uygulama açılınca bir kere üret
        TryConvert(pgmPath, pngPath);

        // map.pgm değişince tekrar üret
        _watcher = new FileSystemWatcher(mapsDir, "map.pgm")
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size | NotifyFilters.FileName,
            EnableRaisingEvents = true
        };

        FileSystemEventHandler handler = (_, __) =>
        {
            // Dosya yazımı bitmeden tetiklenebilir; küçük retry ile sağlamlaştırıyoruz
            _ = Task.Run(async () =>
            {
                await Task.Delay(150, stoppingToken);

                for (int attempt = 1; attempt <= 5 && !stoppingToken.IsCancellationRequested; attempt++)
                {
                    if (TryConvert(pgmPath, pngPath))
                        break;

                    await Task.Delay(200, stoppingToken);
                }
            }, stoppingToken);
        };

        _watcher.Changed += handler;
        _watcher.Created += handler;
        _watcher.Renamed += (_, __) => handler(_, __);

        return Task.CompletedTask;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _watcher?.Dispose();
        return base.StopAsync(cancellationToken);
    }

    private bool TryConvert(string pgmPath, string pngPath)
    {
        try
        {
            if (!File.Exists(pgmPath))
            {
                _logger.LogWarning("map.pgm not found at {Path}", pgmPath);
                return false;
            }

            var bytes = File.ReadAllBytes(pgmPath);
            var (w, h, maxVal, dataOffset) = ParsePgmHeaderP5(bytes);

            // maxVal genelde 255 olur (harita PGM'leri çoğunlukla böyle)
            using var img = new Image<L8>(w, h);

            img.ProcessPixelRows(accessor =>
            {
                int idx = dataOffset;

                for (int y = 0; y < h; y++)
                {
                    var row = accessor.GetRowSpan(y); // ✅ ImageSharp sürümlerinde mevcut

                    for (int x = 0; x < w; x++)
                    {
                        if (idx >= bytes.Length) break;

                        byte v = bytes[idx++];

                        // Occupancy grid'lerde bazen "ters" istenir.
                        // Ters gerekiyorsa aç:
                        // v = (byte)(255 - v);

                        row[x] = new L8(v);
                    }
                }
            });

            // PNG yaz
            using var fs = File.Open(pngPath, FileMode.Create, FileAccess.Write, FileShare.Read);
            img.Save(fs, new PngEncoder());

            _logger.LogInformation("Updated map.png from map.pgm ({W}x{H}, maxVal={Max})", w, h, maxVal);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed converting map.pgm -> map.png");
            return false;
        }
    }

    private static (int w, int h, int maxVal, int dataOffset) ParsePgmHeaderP5(byte[] bytes)
    {
        int i = 0;

        string NextToken()
        {
            // whitespace skip
            while (i < bytes.Length && char.IsWhiteSpace((char)bytes[i])) i++;

            // comment skip
            if (i < bytes.Length && (char)bytes[i] == '#')
            {
                while (i < bytes.Length && (char)bytes[i] != '\n') i++;
                return NextToken();
            }

            int start = i;
            while (i < bytes.Length && !char.IsWhiteSpace((char)bytes[i])) i++;

            return Encoding.ASCII.GetString(bytes, start, i - start);
        }

        var magic = NextToken(); // P5 bekliyoruz
        if (magic != "P5")
            throw new InvalidOperationException($"Unsupported PGM format: {magic}. This worker supports P5.");

        int w = int.Parse(NextToken());
        int h = int.Parse(NextToken());
        int maxVal = int.Parse(NextToken());

        // Header bitti, bir whitespace sonrası data başlar
        while (i < bytes.Length && char.IsWhiteSpace((char)bytes[i])) i++;

        return (w, h, maxVal, i);
    }
}
