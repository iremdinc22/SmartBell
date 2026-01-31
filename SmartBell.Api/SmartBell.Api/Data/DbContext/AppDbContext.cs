using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Domain.Entities;
using SmartBell.Domain.Enums;

namespace SmartBell.Api.Data.DbContext;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Room> Rooms { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<FaceRec> FaceRecs { get; set; } = null!;
    public DbSet<ReservationStatus> ReservationStatuses { get; set; } = null!;
    // Yeni eklenen DbSet'ler
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ROOM CONFIG
        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasIndex(r => r.Code).IsUnique();

            entity.Property(r => r.BasePricePerNight)
                  .HasPrecision(18, 2);

            entity.Property(r => r.Preference)
                  .HasConversion<string>()
                  .HasMaxLength(80);
        });

        // RESERVATION CONFIG
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasIndex(r => r.BookingCode).IsUnique();
            entity.HasIndex(r => new { r.Email, r.BookingCode });

            entity.Property(r => r.Total)
                  .HasPrecision(18, 2);

            entity.Property(r => r.Currency)
                  .HasMaxLength(8);

            entity.Property(r => r.Status)
                  .HasMaxLength(20);

            entity.Property(r => r.FullName)
                  .HasMaxLength(120);

            entity.Property(r => r.Phone)
                  .HasMaxLength(32);

            entity.Property(r => r.RoomPreference)
                  .HasMaxLength(40);

            entity.Property(r => r.RoomTypeSnapshot)
                  .HasMaxLength(40);

            entity.Property(r => r.BookingCode)
                  .HasMaxLength(12);
        });

        // PAYMENT CONFIG
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(p => p.Amount)
                  .HasPrecision(18, 2);

            entity.Property(p => p.Currency)
                  .HasMaxLength(8);

            entity.HasOne(p => p.Reservation)
                  .WithMany(r => r.Payments)
                  .HasForeignKey(p => p.ReservationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // FACE RECOGNITION CONFIG
        modelBuilder.Entity<FaceRec>(entity =>
        {
            entity.HasIndex(f => f.BookingCode).IsUnique();

            entity.Property(f => f.BookingCode)
                  .HasMaxLength(50);
        });

        // RESERVATION STATUS CONFIG (1-1)
        modelBuilder.Entity<ReservationStatus>(entity =>
        {
            entity.HasKey(x => x.ReservationId);
            entity.HasIndex(x => x.BookingCode).IsUnique();

            entity.Property(x => x.BookingCode)
                  .HasMaxLength(12);

            entity.Property(x => x.Status)
                  .HasConversion<string>()
                  .HasMaxLength(40);

            entity.HasOne(x => x.Reservation)
                  .WithOne(r => r.ReservationStatus)
                  .HasForeignKey<ReservationStatus>(x => x.ReservationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(x => x.PinHash).HasMaxLength(512);
            entity.Property(x => x.PinSalt).HasMaxLength(256);
        });

        // ROOM SEED DATA
        modelBuilder.Entity<Room>().HasData(
            new Room {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Code = "A-101",
                Type = "Type A - 2-Person Suite",
                Capacity = 2,
                BasePricePerNight = 120,
                Amenities = Amenity.None
            },
            new Room {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Code = "B-201",
                Type = "Type B - 3-Person Suite",
                Capacity = 3,
                BasePricePerNight = 150,
                Amenities = Amenity.None
            },
            new Room {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Code = "C-301",
                Type = "Type C - 4-Person Family Suite",
                Capacity = 4,
                BasePricePerNight = 180,
                Amenities = Amenity.None
            },
            new Room {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Code = "D-401",
                Type = "Type D - 5-Person Grand Suite",
                Capacity = 5,
                BasePricePerNight = 200,
                Amenities = Amenity.None
            },
            new Room {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Code = "J-501",
                Type = "Rooms with Private Jacuzzi",
                Capacity = 2,
                BasePricePerNight = 220,
                Amenities = Amenity.Jacuzzi
            },
            new Room {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Code = "P-601",
                Type = "Rooms with Infinity Pool",
                Capacity = 2,
                BasePricePerNight = 250,
                Amenities = Amenity.InfinityPool
            },
            new Room {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Code = "PS-701",
                Type = "Premium Suites (Jacuzzi + Pool)",
                Capacity = 3,
                BasePricePerNight = 280,
                Amenities = Amenity.Jacuzzi | Amenity.InfinityPool
            }
        );
    }
}


