namespace SmartBell.Api.Recommendation;

public sealed class RecommendationOptions
{
    public WeightsOptions Weights { get; set; } = new();
    public LimitsOptions Limits { get; set; } = new();

    // RoomPreference enum numeric değerleri
    public int[] HoneymoonAllowedPreferences { get; set; } = Array.Empty<int>();
}

public sealed class WeightsOptions
{
    public decimal AmenityMatch { get; set; } = 40;
    public decimal PriceFit { get; set; } = 25;
    public decimal Interest { get; set; } = 15;
    public decimal PriorityBias { get; set; } = 10;
    public decimal CapacityFit { get; set; } = 10;
}

public sealed class LimitsOptions
{
    public int MaxResults { get; set; } = 10;
}
