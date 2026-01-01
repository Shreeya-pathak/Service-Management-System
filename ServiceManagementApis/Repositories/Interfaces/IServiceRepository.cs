using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface IServiceRepository
{
    Task<List<Service>> GetAllAsync();
    Task<List<Service>> GetByCategoryAsync(int categoryId);
    Task<Service?> GetByIdAsync(int id);
    Task AddAsync(Service service);
    Task UpdateAsync(Service service);
}
