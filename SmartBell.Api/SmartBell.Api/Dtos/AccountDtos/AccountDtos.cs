namespace SmartBell.Api.Dtos;

public record AccountSummaryDto(
    PersonalInfoDto PersonalInfo,
    List<BookingCardDto> UpcomingBookings,
    List<BookingCardDto> PastBookings,
    List<PaymentMethodDto> PaymentMethods,
    AccountStatsDto Stats
);

public record PersonalInfoDto(
    string FirstName,
    string LastName,
    string Email,
    string Phone
);

public record BookingCardDto(
    string BookingCode,
    DateOnly CheckIn,
    DateOnly CheckOut,
    int Nights,
    int Adults,
    int ChildrenUnder12,
    string RoomTitle,
    string Subtitle,
    string StayStatus,
    bool CanCheckIn,
    bool CanCheckOut,
    DateTime? CheckedInAt,
    DateTime? CheckedOutAt
);

public record AccountStatsDto(int UpcomingCount, int PastCount);

public record PaymentMethodDto(string Id, string Brand, string Last4, string Exp);

public record UpdatePersonalInfoRequest(string FirstName, string LastName, string Phone);
