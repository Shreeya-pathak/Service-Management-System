namespace ServiceManagementApis.Models;

public class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? PhoneNumber { get; set; }   // filled later via profile update

    // CURRENT ACTIVE ROLE (used for JWT & authorization)
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;

    // ROLE USER APPLIED FOR (used by admin for approval)
    public int? RequestedRoleId { get; set; }
    public Role? RequestedRole { get; set; }

    public bool IsActive { get; set; } = true;
    public string? AvailabilityStatus { get; set; }

    public DateOnly CreatedAt { get; set; }

    public ICollection<Address> Addresses { get; set; } = new List<Address>();

}
