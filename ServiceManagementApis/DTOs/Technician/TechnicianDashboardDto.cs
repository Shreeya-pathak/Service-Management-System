namespace ServiceManagementApis.DTOs.Technician
{
    public class TechnicianDashboardDto
    {
        public int PendingCount { get; set; }
        public int InProgressCount { get; set; }
        public int CompletedCount { get; set; }

        public string AvailabilityStatus { get; set; } = null!;
    }
}
