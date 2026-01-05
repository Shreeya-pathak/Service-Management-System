namespace ServiceManagementApis.DTOs.Customer
{
    public class CreateServiceRequestDto
    {
        public int ServiceId { get; set; }
        public string IssueDescription { get; set; } = null!;
        public string Priority { get; set; } = null!; // General | Urgent
        public DateOnly RequestedDate { get; set; }
    }
}
