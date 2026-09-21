using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrumbTheoryAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSeededData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Secret",
                table: "BakeryItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Secret",
                table: "BakeryItems",
                type: "TEXT",
                nullable: true);
        }
    }
}
