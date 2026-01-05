using ServiceManagementApis.DTOs.InvoiceAndPayment;
using ServiceManagementApis.Models;

namespace ServiceManagementApis.Services
{
    public interface IInvoiceService
    {
        Task GenerateInvoiceAsync(int serviceRequestId);
        Task<InvoiceDetailsDto> GetInvoiceAsync(int serviceRequestId);
        Task<List<PendingPaymentDto>> GetPendingPaymentApprovalsAsync();
        Task AdminApprovePaymentAsync(int invoiceId, string paymentMethod);
        Task CustomerMakePaymentAsync(int invoiceId);
        Task<int?> GetCustomerIdByInvoiceIdAsync(int invoiceId);
        Task<string?> GetServiceNameByInvoiceIdAsync(int invoiceId);



    }



}
