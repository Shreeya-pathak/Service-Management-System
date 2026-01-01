namespace ServiceManagementApis.Models;

public class TechnicianAssignment
{
    
    public int AssignmentId { get; set; }        // PK

    public int ServiceRequestId { get; set; }    // FK → ServiceRequest
    public ServiceRequest ServiceRequest { get; set; } = null!;

    public int TechnicianId { get; set; }        // FK → Users
    public User Technician { get; set; } = null!;

    public DateOnly AssignedDate { get; set; }
    public string Status { get; set; } = null!;
}
