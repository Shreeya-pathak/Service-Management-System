using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);
    Task SaveAsync();
}
