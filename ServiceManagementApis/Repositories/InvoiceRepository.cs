using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.InvoiceRepositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly AppDbContext _context;

        public InvoiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice?> GetByServiceRequestIdAsync(int serviceRequestId)
        {
            return await _context.Invoices
                .Include(i => i.ServiceRequest)
                    .ThenInclude(sr => sr.Customer)
                .Include(i => i.ServiceRequest)
                    .ThenInclude(sr => sr.Service)
                .FirstOrDefaultAsync(i => i.ServiceRequestId == serviceRequestId);
        }

        public async Task<Invoice?> GetByIdAsync(int invoiceId)
            => await _context.Invoices.FindAsync(invoiceId);
        public async Task<List<Invoice>> GetPendingPaymentApprovalsAsync()
        {
            return await _context.Invoices
                .Include(i => i.ServiceRequest)
                    .ThenInclude(sr => sr.Customer)
                .Include(i => i.ServiceRequest)
                    .ThenInclude(sr => sr.Service)
                .Where(i => i.PaymentStatus == "WaitingForAdminApproval")
                .ToListAsync();
        }
        public async Task AddAsync(Invoice invoice)
        {
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            _context.Invoices.Update(invoice);
            await _context.SaveChangesAsync();
        }
    }

}
