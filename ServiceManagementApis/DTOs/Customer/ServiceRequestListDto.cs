namespace ServiceManagementApis.DTOs.Customer
{
    public class ServiceRequestListDto
    {
        public int ServiceRequestId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public string IssueDescription { get; set; } = null!;
        public DateOnly RequestedDate { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateOnly CreatedAt { get; set; }
        public string? TechnicianName { get; set; }
        public string? Remarks { get; set; }
    }

}
