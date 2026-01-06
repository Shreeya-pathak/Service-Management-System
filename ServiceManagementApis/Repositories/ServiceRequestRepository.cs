using ServiceManagementApis.Data;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementApis.Repositories
{
    public class ServiceRequestRepository : IServiceRequestRepository
    {
        private readonly AppDbContext _context;

        public ServiceRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ServiceRequest request)
        {
            await _context.ServiceRequests.AddAsync(request);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ServiceRequest>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.ServiceRequests
                .Include(sr => sr.Customer)                    
                .Include(sr => sr.Service)
                    .ThenInclude(s => s.ServiceCategory)
                .Include(sr => sr.TechnicianAssignments)
                    .ThenInclude(ta => ta.Technician)
                .Where(sr => sr.CustomerId == customerId)
                .OrderByDescending(sr => sr.ServiceRequestId)
                .ToListAsync();

        }

        public async Task<ServiceRequest?> GetByIdAsync(int id)
        {
            return await _context.ServiceRequests
                .OrderByDescending(sr => sr.CreatedAt)
                .FirstOrDefaultAsync(sr => sr.ServiceRequestId == id);
        }
        public async Task<List<ServiceRequest>> GetAllAsync()
        {
            return await _context.ServiceRequests
                .Include(sr => sr.Customer)

                .Include(sr => sr.Service)
                .OrderByDescending(sr => sr.CreatedAt)
                .ToListAsync();
        }


        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }

}
