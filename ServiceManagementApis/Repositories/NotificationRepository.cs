using ServiceManagementApis.Data;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}
