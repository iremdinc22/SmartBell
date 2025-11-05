using System.ComponentModel;

namespace SmartBell.Domain.Enums
{
    public enum RoomPreference
    {
        [Description("Any Available Room")]
        Any = 0,

        [Description("Type A - 2-Person Suite")]
        TypeA_2PersonSuite = 1,

        [Description("Type B - 3-Person Suite")]
        TypeB_3PersonSuite = 2,

        [Description("Type C - 4-Person Family Suite")]
        TypeC_4PersonFamilySuite = 3,

        [Description("Type D - 5-Person Grand Suite")]
        TypeD_5PersonGrandSuite = 4,

        [Description("Rooms with Private Jacuzzi")]
        PrivateJacuzzi = 5,

        [Description("Rooms with Infinity Pool")]
        InfinityPool = 6,

        [Description("Premium Suites (Jacuzzi + Pool)")]
        PremiumSuites = 7
    }
}