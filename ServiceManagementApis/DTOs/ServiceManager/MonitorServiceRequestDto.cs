namespace ServiceManagementApis.DTOs.ServiceManager
{
    public class MonitorServiceRequestDto
    {
        public int ServiceRequestId { get; set; }

        public string ServiceName { get; set; } = null!;
        public string ServiceCategory { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string IssueDescription { get; set; } = null!;
        public string? TechnicianName { get; set; }

        public string Status { get; set; } = null!;

        public DateOnly RequestedDate { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public DateOnly? CompletedDate { get; set; }

        public string? Remarks { get; set; }
    }
}
