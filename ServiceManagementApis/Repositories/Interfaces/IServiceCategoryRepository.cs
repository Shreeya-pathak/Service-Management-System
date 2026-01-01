using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface IServiceCategoryRepository
{
    Task<List<ServiceCategory>> GetAllAsync();
    Task<ServiceCategory?> GetByIdAsync(int id);
    Task AddAsync(ServiceCategory category);
    Task UpdateAsync(ServiceCategory category);
}
