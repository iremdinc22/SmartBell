using Microsoft.AspNetCore.Http;

namespace SmartBell.Api.Dtos.FaceDtos
{
    public class CheckInDtos
    {
        // form alanı adıyla eşleşmeli (küçük/büyük harf uyuşumu Swagger/UI tarafında gösterilir)
        public string BookingCode { get; set; } = string.Empty;
        public IFormFile? File { get; set; }
    }
}