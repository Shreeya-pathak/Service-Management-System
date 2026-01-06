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
                IssueDescription=a.ServiceRequest.IssueDescription,
                ScheduledDate = a.ServiceRequest.ScheduledDate,
                Status = a.Status,
                CompletedDate = a.ServiceRequest.CompletedDate
            })
            .OrderByDescending(r => r.Status == "ServiceRequestId") 
            .ToListAsync();
    }


    
    public async Task<bool> UpdateRequestStatusAsync(
        
        int serviceRequestId,
        string status,
        DateOnly? completedDate,
        string? remarks
    )
    {
        
        var assignment = await _context.TechnicianAssignments
            .FirstOrDefaultAsync(a => a.ServiceRequestId == serviceRequestId );

        if (assignment == null)
            return false;

        
        assignment.Status = status;

        if (!string.IsNullOrWhiteSpace(remarks))
        {
            assignment.Remarks = remarks;
        }

        
        var request = await _context.ServiceRequests.FindAsync(serviceRequestId);
        if (request == null)
            return false;

        request.Status = status;

        if (status == "Completed" && request.CompletedDate == null)
        {
            request.CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);
            await _invoiceService.GenerateInvoiceAsync(serviceRequestId);
        }

        await _context.SaveChangesAsync();
        return true;
    }



    
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
