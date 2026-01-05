namespace ServiceManagementApis.DTOs.Technician
{
    public class UpdateRequestStatusDto
    {
        public string Status { get; set; } = null!;
        public DateOnly? CompletedDate { get; set; }
    }
}
