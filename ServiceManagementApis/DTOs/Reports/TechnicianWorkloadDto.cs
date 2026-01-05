namespace ServiceManagementApis.DTOs.Reports
{
    public class TechnicianWorkloadDto
    {
        public int TechnicianId { get; set; }
        public string TechnicianName { get; set; } = null!;
        public int ActiveRequestCount { get; set; }
    }
}

