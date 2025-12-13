namespace SmartBell.Api.Dtos.FaceDtos
{
    public class EnrollDto
    {
        public Guid Id { get; set; }
        public string BookingCode { get; set; } = null!;
    }
}