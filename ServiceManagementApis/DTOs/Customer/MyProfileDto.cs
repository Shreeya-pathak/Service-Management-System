namespace ServiceManagementApis.DTOs.Customer
{
    public class MyProfileDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = null!;
        public DateOnly CreatedAt { get; set; }
    }
}
