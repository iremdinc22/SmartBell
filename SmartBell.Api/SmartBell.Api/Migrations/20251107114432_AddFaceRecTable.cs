using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBell.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFaceRecTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FaceRecs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ReservationId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EmbeddingJson = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaceRecs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FaceRecs_BookingCode",
                table: "FaceRecs",
                column: "BookingCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FaceRecs");
        }
    }
}
