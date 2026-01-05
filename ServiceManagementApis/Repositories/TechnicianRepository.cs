using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.DTOs.Technician;
using ServiceManagementApis.Repositories.Interfaces;
using ServiceManagementApis.Services;

namespace ServiceManagementApis.Repositories.Implementations;

public class TechnicianRepository : ITechnicianRepository
{
    private readonly AppDbContext _context;
    private readonly IInvoiceService _invoiceService;


    public TechnicianRepository(AppDbContext context, IInvoiceService invoiceService)
    {
        _context = context;

        _invoiceService = invoiceService;



    }

    // ---------------- DASHBOARD ----------------
    public async Task<TechnicianDashboardDto> GetDashboardAsync(int technicianId)
    {
        var assignments = _context.TechnicianAssignments
            .Include(a => a.ServiceRequest)
            .Where(a => a.TechnicianId == technicianId);

        return new TechnicianDashboardDto
        {
            PendingCount = await assignments.CountAsync(a => a.ServiceRequest.Status == "Pending"),
            InProgressCount = await assignments.CountAsync(a => a.ServiceRequest.Status == "In-Progress"),
            CompletedCount = await assignments.CountAsync(a => a.ServiceRequest.Status == "Completed"),
            AvailabilityStatus = await _context.Users
                .Where(u => u.UserId == technicianId)
                .Select(u => u.AvailabilityStatus!)
                .FirstAsync()
        };
    }

    // ---------------- ASSIGNED REQUESTS ----------------
    public async Task<List<TechnicianRequestDto>> GetAssignedRequestsAsync(int technicianId)
    {
        return await _context.TechnicianAssignments
            .Include(a => a.ServiceRequest)
                .ThenInclude(r => r.Service)
                    .ThenInclude(s => s.ServiceCategory)
            .Include(a => a.ServiceRequest.Customer)
            .Where(a => a.TechnicianId == technicianId)
            .Select(a => new TechnicianRequestDto
            {
                ServiceRequestId = a.ServiceRequestId,
                ServiceName = a.ServiceRequest.Service.ServiceName,
                ServiceCategory = a.ServiceRequest.Service.ServiceCategory.CategoryName,
                CustomerName = a.ServiceRequest.Customer.FullName,
                ScheduledDate = a.ServiceRequest.ScheduledDate,
                Status = a.ServiceRequest.Status,
                CompletedDate = a.ServiceRequest.CompletedDate
            })
            .OrderByDescending(r => r.Status == "Completed") // optional
            .ToListAsync();
    }


    // ---------------- UPDATE STATUS ----------------
    public async Task<bool> UpdateRequestStatusAsync(int serviceRequestId, string status, DateOnly? completedDate)
    {
        var request = await _context.ServiceRequests.FindAsync(serviceRequestId);
        if (request == null) return false;

        request.Status = status;
        request.CompletedDate = completedDate;

        if (status == "Completed")
            request.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);

        await _context.SaveChangesAsync();
        await _invoiceService.GenerateInvoiceAsync(request.ServiceRequestId);
        return true;

        

    }

    // ---------------- AVAILABILITY ----------------
    public async Task<bool> UpdateAvailabilityAsync(int technicianId, string availabilityStatus)
    {
        var tech = await _context.Users.FindAsync(technicianId);
        if (tech == null) return false;

        tech.AvailabilityStatus = availabilityStatus;
        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<int?> GetCustomerIdByRequestIdAsync(int serviceRequestId)
    {
        return await _context.ServiceRequests
            .Where(r => r.ServiceRequestId == serviceRequestId)
            .Select(r => (int?)r.CustomerId)
            .FirstOrDefaultAsync();
    }
    public async Task<string?> GetServiceNameByRequestIdAsync(int serviceRequestId)
    {
        return await _context.ServiceRequests
            .Where(r => r.ServiceRequestId == serviceRequestId)
            .Select(r => r.Service.ServiceName)
            .FirstOrDefaultAsync();
    }

}
