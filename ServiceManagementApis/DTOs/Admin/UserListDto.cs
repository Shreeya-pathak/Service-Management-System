namespace ServiceManagementApis.DTOs.Admin;

public class UserListDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string RoleName { get; set; } = null!;
    public bool IsActive { get; set; }
}
