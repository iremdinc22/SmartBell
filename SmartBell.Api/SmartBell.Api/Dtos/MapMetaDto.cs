public sealed class MapMetaDto
{
    public int Width { get; set; }
    public int Height { get; set; }
    public double Resolution { get; set; }
    public double OriginX { get; set; }
    public double OriginY { get; set; }
    public double OriginYaw { get; set; }
    public int Negate { get; set; }
    public bool FlipY { get; set; }
    public string PngUrl { get; set; } = "";
}
