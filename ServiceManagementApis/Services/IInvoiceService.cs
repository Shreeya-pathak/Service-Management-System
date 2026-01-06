using ServiceManagementApis.DTOs.InvoiceAndPayment;

namespace ServiceManagementApis.Services
{
    public interface IInvoiceService
    {
        Task GenerateInvoiceAsync(int serviceRequestId);
        Task<InvoiceDetailsDto> GetInvoiceAsync(int serviceRequestId);

        Task CustomerMakePaymentAsync(int invoiceId, string paymentMethod);

        Task<int?> GetCustomerIdByInvoiceIdAsync(int invoiceId);
        Task<string?> GetServiceNameByInvoiceIdAsync(int invoiceId);
    }
}
