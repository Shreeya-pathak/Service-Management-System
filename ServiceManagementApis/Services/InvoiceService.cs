using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.InvoiceAndPayment;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.InvoiceRepositories;
using ServiceManagementApis.Repositories.PaymentRepositories;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementApis.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _context;
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly IPaymentRepository _paymentRepo;

        public InvoiceService(
            AppDbContext context,
            IInvoiceRepository invoiceRepo,
            IPaymentRepository paymentRepo)
        {
            _context = context;
            _invoiceRepo = invoiceRepo;
            _paymentRepo = paymentRepo;
        }

        
        public async Task GenerateInvoiceAsync(int serviceRequestId)
        {
            var request = await _context.ServiceRequests
                .Include(sr => sr.Service)
                .FirstOrDefaultAsync(sr => sr.ServiceRequestId == serviceRequestId);

            if (request == null)
                throw new Exception("Service request not found");

            if (!request.Status.Equals("Completed", StringComparison.OrdinalIgnoreCase))
                return;

            var existing = await _invoiceRepo.GetByServiceRequestIdAsync(serviceRequestId);
            if (existing != null)
                return;

            var invoice = new Invoice
            {
                ServiceRequestId = serviceRequestId,
                InvoiceDate = DateOnly.FromDateTime(DateTime.UtcNow),
                TotalAmount = request.Service.Price,
                PaymentStatus = "Pending"
            };

            await _invoiceRepo.AddAsync(invoice);
        }

        
        public async Task<InvoiceDetailsDto> GetInvoiceAsync(int serviceRequestId)
        {
            var invoice = await _invoiceRepo.GetByServiceRequestIdAsync(serviceRequestId)
                ?? throw new Exception("Invoice not found");

            return new InvoiceDetailsDto
            {
                InvoiceId = invoice.InvoiceId,

                CustomerName = invoice.ServiceRequest.Customer.FullName,
                CustomerEmail = invoice.ServiceRequest.Customer.Email,
                CustomerPhone = invoice.ServiceRequest.Customer.PhoneNumber,

                ServiceName = invoice.ServiceRequest.Service.ServiceName,
                IssueDescription = invoice.ServiceRequest.IssueDescription,

                InvoiceDate = invoice.InvoiceDate,
                TotalAmount = invoice.TotalAmount,
                PaymentStatus = invoice.PaymentStatus
            };
        }

        
        public async Task CustomerMakePaymentAsync(int invoiceId, string paymentMethod)
        {
            var invoice = await _context.Invoices
                .Include(i => i.ServiceRequest)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId)
                ?? throw new Exception("Invoice not found");

            if (invoice.PaymentStatus != "Pending")
                throw new Exception("Invoice already paid");

            
            var payment = new Payment
            {
                InvoiceId = invoice.InvoiceId,
                AmountPaid = invoice.TotalAmount,
                PaymentMethod = paymentMethod,
                PaymentDate = DateTime.UtcNow
            };

            await _paymentRepo.AddAsync(payment);

            
            invoice.PaymentStatus = "Paid";


            invoice.ServiceRequest.Status = "Closed";
            _context.ServiceRequests.Update(invoice.ServiceRequest);

            await _context.SaveChangesAsync();
        }

        
        public async Task<int?> GetCustomerIdByInvoiceIdAsync(int invoiceId)
        {
            return await _context.Invoices
                .Where(i => i.InvoiceId == invoiceId)
                .Select(i => (int?)i.ServiceRequest.CustomerId)
                .FirstOrDefaultAsync();
        }

        public async Task<string?> GetServiceNameByInvoiceIdAsync(int invoiceId)
        {
            return await _context.Invoices
                .Where(i => i.InvoiceId == invoiceId)
                .Select(i => i.ServiceRequest.Service.ServiceName)
                .FirstOrDefaultAsync();
        }
    }
}
