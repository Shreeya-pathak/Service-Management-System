namespace ServiceManagementApis.Models;

public class ServiceRequest
{
    public int ServiceRequestId { get; set; }    // PK

    public int CustomerId { get; set; }          // FK → Users
    public User Customer { get; set; } = null!;

    public int ServiceId { get; set; }            // FK → Services
    public Service Service { get; set; } = null!;

    public string IssueDescription { get; set; } = null!;
    public string Priority { get; set; } = null!;

    public DateOnly RequestedDate { get; set; }
    public DateOnly? ScheduledDate { get; set; } // nullable until scheduled

    public string Status { get; set; } = null!;
    public DateOnly CreatedAt { get; set; }
}
