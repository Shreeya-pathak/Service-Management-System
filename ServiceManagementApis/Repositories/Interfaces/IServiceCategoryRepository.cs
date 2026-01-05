using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface IServiceCategoryRepository
{
    Task<List<ServiceCategory>> GetAllAsync();
    Task<List<ServiceCategory>> GetActiveAsync();
    Task<ServiceCategory?> GetByIdAsync(int id);
    Task AddAsync(ServiceCategory category);
    Task UpdateAsync(ServiceCategory category);
    Task DeleteAsync(ServiceCategory category);
    Task<bool> IsCategoryInUseAsync(int categoryId);
}
