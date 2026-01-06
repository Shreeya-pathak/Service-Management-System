using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceManagementApis.Migrations
{
    /// <inheritdoc />
    public partial class NewRemarksField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "TechnicianAssignments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "TechnicianAssignments");
        }
    }
}
