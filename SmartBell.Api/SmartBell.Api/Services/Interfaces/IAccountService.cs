using SmartBell.Api.Dtos;

namespace SmartBell.Api.Services.Account;

public interface IAccountService
{
    Task<AccountSummaryDto> GetSummaryAsync(string email, string bookingCode);
    Task<PersonalInfoDto> UpdatePersonalInfoAsync(string email, string bookingCode, UpdatePersonalInfoRequest req);
    Task<List<BookingCardDto>> GetBookingsAsync(string email, string bookingCode, string type);
}
