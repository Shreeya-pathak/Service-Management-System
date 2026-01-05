using ServiceManagementApis.DTOs;
using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.PaymentRepositories
{
    public interface IPaymentRepository
    {
        Task AddAsync(Payment payment);
        Task<List<Payment>> GetAllAsync();

    }


}
