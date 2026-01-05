namespace ServiceManagementApis.DTOs.ServiceManager
{
    public class ServiceManagerDashboardDto
    {
        public int NewRequests { get; set; }
        public int Scheduled { get; set; }
        public int InProgress { get; set; }
        public int CompletedToday { get; set; }
        public int AvailableTechnicians { get; set; }
    }
}
