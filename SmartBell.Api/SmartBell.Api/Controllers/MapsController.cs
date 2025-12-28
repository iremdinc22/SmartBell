using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Globalization;
using System.Text;

[ApiController]
[Route("api/maps")]
public class MapsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public MapsController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet("meta")]
    public ActionResult<MapMetaDto> GetMeta()
    {
        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var mapsDir = Path.Combine(webRoot, "maps");

        var yamlPath = Path.Combine(mapsDir, "map.yaml");
        var pgmPath = Path.Combine(mapsDir, "map.pgm");

        if (!System.IO.File.Exists(yamlPath))
            return NotFound("map.yaml not found");

        if (!System.IO.File.Exists(pgmPath))
            return NotFound("map.pgm not found");

        // YAML oku
        var (resolution, originX, originY, originYaw, negate) = ReadYaml(yamlPath);

        // PGM header'dan width/height oku (P5)
        var bytes = System.IO.File.ReadAllBytes(pgmPath);
        var (w, h) = ParsePgmSizeP5(bytes);

        // Worker'daki flipY ile aynı olsun (sen true kullanıyorsun)
        var dto = new MapMetaDto
        {
            Width = w,
            Height = h,
            Resolution = resolution,
            OriginX = originX,
            OriginY = originY,
            OriginYaw = originYaw,
            Negate = negate,
            FlipY = true,
            PngUrl = "/maps/map.png"
        };

        return Ok(dto);
    }

    private static (double resolution, double ox, double oy, double yaw, int negate) ReadYaml(string yamlPath)
    {
        double res = 0.05;
        double ox = 0, oy = 0, yaw = 0;
        int negate = 0;

        foreach (var raw in System.IO.File.ReadLines(yamlPath))
        {
            var line = raw.Trim();
            if (line.Length == 0 || line.StartsWith("#")) continue;

            var sep = line.IndexOf(':');
            if (sep <= 0) continue;

            var key = line[..sep].Trim();
            var val = line[(sep + 1)..].Trim().Trim('"').Trim('\'');

            if (key.Equals("resolution", StringComparison.OrdinalIgnoreCase) &&
                double.TryParse(val, NumberStyles.Float, CultureInfo.InvariantCulture, out var r))
                res = r;

            if (key.Equals("origin", StringComparison.OrdinalIgnoreCase))
            {
                // origin: [-10, -5.51, 0]
                val = val.Trim().TrimStart('[').TrimEnd(']');
                var parts = val.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                if (parts.Length >= 3)
                {
                    double.TryParse(parts[0], NumberStyles.Float, CultureInfo.InvariantCulture, out ox);
                    double.TryParse(parts[1], NumberStyles.Float, CultureInfo.InvariantCulture, out oy);
                    double.TryParse(parts[2], NumberStyles.Float, CultureInfo.InvariantCulture, out yaw);
                }
            }

            if (key.Equals("negate", StringComparison.OrdinalIgnoreCase) &&
                int.TryParse(val, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n))
                negate = n;
        }

        return (res, ox, oy, yaw, negate);
    }

    private static (int w, int h) ParsePgmSizeP5(byte[] bytes)
    {
        int i = 0;

        string NextToken()
        {
            while (i < bytes.Length && char.IsWhiteSpace((char)bytes[i])) i++;

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
        if (magic != "P5") throw new InvalidOperationException("PGM must be P5");

        int w = int.Parse(NextToken(), CultureInfo.InvariantCulture);
        int h = int.Parse(NextToken(), CultureInfo.InvariantCulture);
        return (w, h);
    }
}
