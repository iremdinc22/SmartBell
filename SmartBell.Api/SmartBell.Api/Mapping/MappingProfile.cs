using AutoMapper;
using SmartBell.Api.Domain.Entities;
using SmartBell.Api.Dtos.PaymentDtos;
using SmartBell.Api.Dtos.ReservationDtos;
using SmartBell.Api.Dtos.RoomDtos;

namespace SmartBell.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
    
            // ROOM
            CreateMap<Room, RoomDto>().ReverseMap();

            CreateMap<CreateRoomDto, Room>();
            CreateMap<UpdateRoomDto, Room>();

      
            // RESERVATION
            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.Nights, map => map.MapFrom(src => src.Nights));

            // Create DTO → Entity
            CreateMap<CreateReservationDto, Reservation>()
                .ForMember(dest => dest.RoomTypeSnapshot, map => map.MapFrom(src => "Any"))
                .ForMember(dest => dest.Total, map => map.Ignore())
                .ForMember(dest => dest.BookingCode, map => map.Ignore())
                .ForMember(dest => dest.Status, map => map.Ignore())
                .ForMember(dest => dest.Payments, map => map.Ignore());

            // Sadece durum güncelleme (admin/ödeme sonrası)
            CreateMap<UpdateReservationStatusDto, Reservation>()
                .ForAllMembers(map => map.Condition((src, dest, value) => value != null));
            
            
            // PAYMENT
            CreateMap<Payment, PaymentDto>();

            CreateMap<CreatePaymentDto, Payment>()
                .ForMember(dest => dest.Status, map => map.Ignore())
                .ForMember(dest => dest.Currency, map => map.MapFrom(src => src.Currency));

            CreateMap<UpdatePaymentStatusDto, Payment>()
                .ForMember(dest => dest.Status, map => map.MapFrom(src => src.Status))
                .ForAllMembers(map => map.Condition((src, dest, value) => value != null));
        }
    }
}
