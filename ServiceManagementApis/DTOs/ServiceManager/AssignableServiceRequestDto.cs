namespace ServiceManagementApis.DTOs.ServiceManager
{
    

    public class AssignableServiceRequestDto
    {
        public int ServiceRequestId { get; set; }
        public int CustomerId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string ServiceCategory { get; set; } = null!;
        public string CustomerName { get; set; } = null!;

        public string IssueDescription { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public DateOnly RequestedDate { get; set; }
        public DateOnly? ScheduledDate { get; set; }

        public string Status { get; set; } = null!;

        
        public int? TechnicianId { get; set; }
        public string? TechnicianName { get; set; }
    }


}
