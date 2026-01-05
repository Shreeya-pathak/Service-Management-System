namespace ServiceManagementApis.DTOs.Notifications
{
    public class NotificationResponseDto
    {
        public int NotificationId { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }

}
