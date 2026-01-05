using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.InvoiceRepositories
{
    public interface IInvoiceRepository
    {
        Task<Invoice?> GetByServiceRequestIdAsync(int serviceRequestId);
        Task<Invoice?> GetByIdAsync(int invoiceId);
        Task<List<Invoice>> GetPendingPaymentApprovalsAsync();
        Task AddAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);
    }


}
