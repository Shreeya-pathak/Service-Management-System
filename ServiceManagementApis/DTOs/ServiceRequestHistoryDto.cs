namespace ServiceManagementApis.DTOs
{
    public class ServiceRequestHistoryDto
    {
        public int ServiceRequestId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string ServiceName { get; set; } = null!;
        public string IssueDescription { get; set; } = null!;
        public DateOnly RequestedDate { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public DateOnly? CompletedDate { get; set; }
        public string Status { get; set; } = null!;
    }
}
