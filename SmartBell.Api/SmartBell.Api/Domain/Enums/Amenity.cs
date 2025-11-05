using System;

namespace SmartBell.Domain.Enums
{
    [Flags]
    public enum Amenity
    {
        None            = 0,       // Özellik yok
        Jacuzzi         = 1 << 0,  // 1
        InfinityPool    = 1 << 1,  // 2
        AirConditioning = 1 << 2,  // 4
        MiniBar         = 1 << 3,  // 8
        SeaView         = 1 << 4,  // 16
        Balcony         = 1 << 5,  // 32
        SmartTV         = 1 << 6   // 64
    }
}