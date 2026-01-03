using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBell.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckInOut : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraChargeAmount",
                table: "ReservationStatus");

            migrationBuilder.DropColumn(
                name: "PaymentCompleted",
                table: "ReservationStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ExtraChargeAmount",
                table: "ReservationStatus",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "PaymentCompleted",
                table: "ReservationStatus",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
