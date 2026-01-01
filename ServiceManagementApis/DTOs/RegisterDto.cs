namespace ServiceManagementApis.DTOs;

public class RegisterDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string RoleName { get; set; } = null!; // from frontend dropdown
}
