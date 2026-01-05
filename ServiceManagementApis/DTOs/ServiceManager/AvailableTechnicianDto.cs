namespace ServiceManagementApis.DTOs.ServiceManager
{
    public class AvailableTechnicianDto
    {
        public int TechnicianId { get; set; }
        public string TechnicianName { get; set; } = null!;
        public int ActiveTasks { get; set; }
    }
}
