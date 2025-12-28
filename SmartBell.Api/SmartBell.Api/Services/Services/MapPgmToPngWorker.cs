using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using System.Globalization;
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
        var yamlPath = Path.Combine(mapsDir, "map.yaml");
        var pngPath = Path.Combine(mapsDir, "map.png");

        // App start: generate once
        TryConvert(pgmPath, yamlPath, pngPath);

        // Re-generate when map.pgm or map.yaml changes
        _watcher = new FileSystemWatcher(mapsDir)
        {
            Filter = "*.*",
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size | NotifyFilters.FileName,
            EnableRaisingEvents = true
        };

        FileSystemEventHandler handler = (_, e) =>
        {
            var name = (e.Name ?? "").ToLowerInvariant();
            if (name is not ("map.pgm" or "map.yaml")) return;

            _ = Task.Run(async () =>
            {
                // File writes can trigger early; small retry window makes it robust
                await Task.Delay(150, stoppingToken);

                for (int attempt = 1; attempt <= 6 && !stoppingToken.IsCancellationRequested; attempt++)
                {
                    if (TryConvert(pgmPath, yamlPath, pngPath))
                        break;

                    await Task.Delay(220, stoppingToken);
                }
            }, stoppingToken);
        };

        _watcher.Changed += handler;
        _watcher.Created += handler;
        _watcher.Renamed += (_, e) => handler(_, e);

        return Task.CompletedTask;
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _watcher?.Dispose();
        return base.StopAsync(cancellationToken);
    }

    private bool TryConvert(string pgmPath, string yamlPath, string pngPath)
    {
        try
        {
            if (!File.Exists(pgmPath))
            {
                _logger.LogWarning("map.pgm not found at {Path}", pgmPath);
                return false;
            }

            // Optional: read negate / thresholds from YAML (if exists)
            var yaml = ReadMapYaml(yamlPath);

            // UX knobs (safe defaults)
            bool flipY = true;                 // makes map look correct in most viewers
            bool negate = yaml.Negate == 1;     // from yaml: negate: 0/1
            byte unknownValue = 205;            // ROS map "unknown" often = 205
            int unknownTolerance = 6;           // 205 ± 6
            int occTolerance = 6;               // 0..6 occupied-ish
            int freeFloor = 250;                // 250..255 free-ish

            var bytes = File.ReadAllBytes(pgmPath);
            var (w, h, maxVal, dataOffset) = ParsePgmHeaderP5(bytes);

            using var img = new Image<Rgba32>(w, h);

            img.ProcessPixelRows(accessor =>
            {
                int idx = dataOffset;

                for (int y = 0; y < h; y++)
                {
                    int dstY = flipY ? (h - 1 - y) : y;
                    var row = accessor.GetRowSpan(dstY);

                    for (int x = 0; x < w; x++)
                    {
                        if (idx >= bytes.Length) break;

                        byte v = bytes[idx++];

                        if (negate)
                            v = (byte)(maxVal - v);

                        // Trinary-ish styling:
                        // - occupied => black
                        // - free => white
                        // - unknown => light gray
                        Rgba32 color;

                        if (v <= occTolerance)
                        {
                            color = new Rgba32(0, 0, 0, 255);
                        }
                        else if (v >= freeFloor)
                        {
                            color = new Rgba32(255, 255, 255, 255);
                        }
                        else if (Math.Abs(v - unknownValue) <= unknownTolerance)
                        {
                            // You can make this slightly transparent if you want:
                            // new Rgba32(230, 230, 230, 200)
                            color = new Rgba32(230, 230, 230, 255);
                        }
                        else
                        {
                            // Fallback (some maps have intermediate values)
                            color = new Rgba32(v, v, v, 255);
                        }

                        row[x] = color;
                    }
                }
            });

            using var fs = File.Open(pngPath, FileMode.Create, FileAccess.Write, FileShare.Read);
            img.Save(fs, new PngEncoder());

            _logger.LogInformation(
                "Updated map.png from map.pgm ({W}x{H}, maxVal={Max}, negate={Neg}, flipY={FlipY})",
                w, h, maxVal, negate, flipY);

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

            // comment skip (# ... endline)
            if (i < bytes.Length && (char)bytes[i] == '#')
            {
                while (i < bytes.Length && (char)bytes[i] != '\n') i++;
                return NextToken();
            }

            int start = i;
            while (i < bytes.Length && !char.IsWhiteSpace((char)bytes[i])) i++;

            return Encoding.ASCII.GetString(bytes, start, i - start);
        }

        var magic = NextToken();
        if (magic != "P5")
            throw new InvalidOperationException($"Unsupported PGM format: {magic}. This worker supports P5.");

        int w = int.Parse(NextToken(), CultureInfo.InvariantCulture);
        int h = int.Parse(NextToken(), CultureInfo.InvariantCulture);
        int maxVal = int.Parse(NextToken(), CultureInfo.InvariantCulture);

        // Header ends; data begins after one whitespace
        while (i < bytes.Length && char.IsWhiteSpace((char)bytes[i])) i++;

        return (w, h, maxVal, i);
    }

    private static MapYaml ReadMapYaml(string yamlPath)
    {
        // We only care about a few fields; keep it simple (no YAML parser dependency)
        var result = new MapYaml();

        if (!File.Exists(yamlPath))
            return result;

        foreach (var rawLine in File.ReadLines(yamlPath))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith("#")) continue;

            // key: value
            int sep = line.IndexOf(':');
            if (sep <= 0) continue;

            var key = line.Substring(0, sep).Trim();
            var value = line.Substring(sep + 1).Trim();

            // strip quotes
            value = value.Trim().Trim('"').Trim('\'');

            if (key.Equals("negate", StringComparison.OrdinalIgnoreCase)
                && int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var negate))
            {
                result.Negate = negate;
            }
            else if (key.Equals("occupied_thresh", StringComparison.OrdinalIgnoreCase)
                && double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var occ))
            {
                result.OccupiedThresh = occ;
            }
            else if (key.Equals("free_thresh", StringComparison.OrdinalIgnoreCase)
                && double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var free))
            {
                result.FreeThresh = free;
            }
        }

        return result;
    }

    private sealed class MapYaml
    {
        public int Negate { get; set; } = 0;
        public double OccupiedThresh { get; set; } = 0.65;
        public double FreeThresh { get; set; } = 0.25;
    }
}
