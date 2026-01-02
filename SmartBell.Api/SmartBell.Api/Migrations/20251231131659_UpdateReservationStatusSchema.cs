using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SmartBell.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReservationStatusSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ReservationStatus");

            migrationBuilder.AddColumn<string>(
                name: "BookingCode",
                table: "ReservationStatus",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus",
                column: "ReservationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus");

            migrationBuilder.DropColumn(
                name: "BookingCode",
                table: "ReservationStatus");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ReservationStatus",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus",
                column: "Id");
        }
    }
}
