using SmartBell.Domain.Enums;

namespace SmartBell.Api.Dtos.RoomDtos
{
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int Capacity { get; set; }
        public decimal BasePricePerNight { get; set; }
        public RoomPreference Preference { get; set; }
        public Amenity Amenities { get; set; }
        public string Status { get; set; } = "Active";
    }
}