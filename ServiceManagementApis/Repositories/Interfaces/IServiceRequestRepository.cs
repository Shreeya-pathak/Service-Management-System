using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces
{
    public interface IServiceRequestRepository
    {
        Task AddAsync(ServiceRequest request);
        Task<List<ServiceRequest>> GetByCustomerIdAsync(int customerId);
        Task<ServiceRequest?> GetByIdAsync(int id);
        Task SaveAsync();
        Task<List<ServiceRequest>> GetAllAsync();     // Admin

    }

}
