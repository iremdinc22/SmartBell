using System;
using System.ComponentModel.DataAnnotations;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Dtos.RoomDtos
{
    public class UpdateRoomDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required, MaxLength(16)]
        public string Code { get; set; } = null!;

        [Required, MaxLength(40)]
        public string Type { get; set; } = null!;

        [Range(1, 10)]
        public int Capacity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePricePerNight { get; set; }

        [Required]
        public RoomPreference Preference { get; set; } = RoomPreference.Any;

        public Amenity Amenities { get; set; } = Amenity.None;

        [MaxLength(20)]
        public string Status { get; set; } = "Active";
    }
}