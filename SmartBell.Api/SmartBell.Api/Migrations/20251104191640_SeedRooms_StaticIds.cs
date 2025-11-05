using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartBell.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedRooms_StaticIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("576d6c6b-7007-426c-9bdd-d1fecb1e102a"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("5ea50d27-46b0-4147-9c29-2e93e3064c02"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("6587111d-0d30-4619-bc77-122f42793c57"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("a293450f-39d6-4876-9cfa-d46262582388"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("ca7ea75f-751e-443e-8bc5-b9dd792e93c1"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("cdf67845-cc40-447f-afd4-817a81e4d7e4"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("ff007465-cb35-455c-80a8-747f1cdef6a2"));

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "Amenities", "BasePricePerNight", "Capacity", "Code", "Preference", "Status", "Type" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), 0, 120m, 2, "A-101", "Any", "Active", "Type A - 2-Person Suite" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), 0, 150m, 3, "B-201", "Any", "Active", "Type B - 3-Person Suite" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 0, 180m, 4, "C-301", "Any", "Active", "Type C - 4-Person Family Suite" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), 0, 200m, 5, "D-401", "Any", "Active", "Type D - 5-Person Grand Suite" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), 1, 220m, 2, "J-501", "Any", "Active", "Rooms with Private Jacuzzi" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), 2, 250m, 2, "P-601", "Any", "Active", "Rooms with Infinity Pool" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), 3, 280m, 3, "PS-701", "Any", "Active", "Premium Suites (Jacuzzi + Pool)" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777777"));

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "Amenities", "BasePricePerNight", "Capacity", "Code", "Preference", "Status", "Type" },
                values: new object[,]
                {
                    { new Guid("576d6c6b-7007-426c-9bdd-d1fecb1e102a"), 0, 200m, 5, "D-401", "TypeD_5PersonGrandSuite", "Active", "Type D - 5-Person Grand Suite" },
                    { new Guid("5ea50d27-46b0-4147-9c29-2e93e3064c02"), 0, 180m, 4, "C-301", "TypeC_4PersonFamilySuite", "Active", "Type C - 4-Person Family Suite" },
                    { new Guid("6587111d-0d30-4619-bc77-122f42793c57"), 0, 120m, 2, "A-101", "TypeA_2PersonSuite", "Active", "Type A - 2-Person Suite" },
                    { new Guid("a293450f-39d6-4876-9cfa-d46262582388"), 3, 280m, 3, "PS-701", "PremiumSuites", "Active", "Premium Suites (Jacuzzi + Pool)" },
                    { new Guid("ca7ea75f-751e-443e-8bc5-b9dd792e93c1"), 2, 250m, 2, "P-601", "InfinityPool", "Active", "Rooms with Infinity Pool" },
                    { new Guid("cdf67845-cc40-447f-afd4-817a81e4d7e4"), 1, 220m, 2, "J-501", "PrivateJacuzzi", "Active", "Rooms with Private Jacuzzi" },
                    { new Guid("ff007465-cb35-455c-80a8-747f1cdef6a2"), 0, 150m, 3, "B-201", "TypeB_3PersonSuite", "Active", "Type B - 3-Person Suite" }
                });
        }
    }
}
