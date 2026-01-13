using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBell.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationStatusNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationStatus_Reservations_ReservationId",
                table: "ReservationStatus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus");

            migrationBuilder.DropIndex(
                name: "IX_ReservationStatus_ReservationId",
                table: "ReservationStatus");

            migrationBuilder.RenameTable(
                name: "ReservationStatus",
                newName: "ReservationStatuses");

            migrationBuilder.AlterColumn<string>(
                name: "BookingCode",
                table: "ReservationStatuses",
                type: "character varying(12)",
                maxLength: 12,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReservationStatuses",
                table: "ReservationStatuses",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Email_BookingCode",
                table: "Reservations",
                columns: new[] { "Email", "BookingCode" });

            migrationBuilder.CreateIndex(
                name: "IX_ReservationStatuses_BookingCode",
                table: "ReservationStatuses",
                column: "BookingCode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationStatuses_Reservations_ReservationId",
                table: "ReservationStatuses",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReservationStatuses_Reservations_ReservationId",
                table: "ReservationStatuses");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_Email_BookingCode",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReservationStatuses",
                table: "ReservationStatuses");

            migrationBuilder.DropIndex(
                name: "IX_ReservationStatuses_BookingCode",
                table: "ReservationStatuses");

            migrationBuilder.RenameTable(
                name: "ReservationStatuses",
                newName: "ReservationStatus");

            migrationBuilder.AlterColumn<string>(
                name: "BookingCode",
                table: "ReservationStatus",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(12)",
                oldMaxLength: 12);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReservationStatus",
                table: "ReservationStatus",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationStatus_ReservationId",
                table: "ReservationStatus",
                column: "ReservationId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationStatus_Reservations_ReservationId",
                table: "ReservationStatus",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
