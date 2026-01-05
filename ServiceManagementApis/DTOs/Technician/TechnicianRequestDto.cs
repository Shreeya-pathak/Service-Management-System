namespace ServiceManagementApis.DTOs.Technician
{
    public class TechnicianRequestDto
    {
        public int ServiceRequestId { get; set; }
        public string ServiceName { get; set; } = null!;
        public string ServiceCategory { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public DateOnly? ScheduledDate { get; set; }
        public string Status { get; set; } = null!;
        public DateOnly? CompletedDate { get; set; }
    }
}
