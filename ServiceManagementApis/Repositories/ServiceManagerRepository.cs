using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.ServiceManager;

using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Repositories.Implementations;

public class ServiceManagerRepository : IServiceManagerRepository
{
    private readonly AppDbContext _context;

    public ServiceManagerRepository(AppDbContext context)
    {
        _context = context;
    }

    // ===================== DASHBOARD =====================
    public async Task<ServiceManagerDashboardDto> GetDashboardAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        return new ServiceManagerDashboardDto
        {
            NewRequests = await _context.ServiceRequests
                .CountAsync(r => r.Status == "Pending"),

            Scheduled = await _context.ServiceRequests
                .CountAsync(r => r.Status == "Assigned"),

            InProgress = await _context.ServiceRequests
                .CountAsync(r => r.Status == "In-Progress"),

            CompletedToday = await _context.ServiceRequests
                .CountAsync(r =>
                    r.Status == "Completed" &&
                    r.CompletedDate == today
                ),

            AvailableTechnicians = await _context.Users
                .CountAsync(u =>
                    u.Role.RoleName == "Technician" &&
                    u.IsActive &&
                    u.AvailabilityStatus == "Available"
                )
        };
    }

    // ===================== ASSIGNABLE REQUEST CARDS =====================
    public async Task<List<AssignableServiceRequestDto>> GetAssignableRequestsAsync()
    {
        return await _context.ServiceRequests
            .Include(r => r.Service)
                .ThenInclude(s => s.ServiceCategory)
            .Include(r => r.Customer)
            .Include(r => r.TechnicianAssignments)
                .ThenInclude(a => a.Technician)
            .Where(r => r.Status == "Pending" || r.Status == "Assigned")
            .Select(r => new AssignableServiceRequestDto
            {
                ServiceRequestId = r.ServiceRequestId,
                ServiceName = r.Service.ServiceName,
                ServiceCategory = r.Service.ServiceCategory.CategoryName,
                CustomerName = r.Customer.FullName,
                IssueDescription=r.IssueDescription,
                Priority=r.Priority,
                RequestedDate = r.RequestedDate,
                ScheduledDate = r.ScheduledDate,
                Status = r.Status,

                TechnicianId = r.TechnicianAssignments
                    .Select(a => (int?)a.TechnicianId)
                    .FirstOrDefault(),

                TechnicianName = r.TechnicianAssignments
                    .Select(a => a.Technician.FullName)
                    .FirstOrDefault()
            })
            .ToListAsync();
    }

    // ===================== AVAILABLE TECHNICIANS =====================
    public async Task<List<AvailableTechnicianDto>> GetAvailableTechniciansAsync()
    {
        return await _context.Users
            .Where(u =>
                u.Role.RoleName == "Technician" &&
                u.IsActive &&
                u.AvailabilityStatus == "Available"
            )
            .Select(u => new AvailableTechnicianDto
            {
                TechnicianId = u.UserId,
                TechnicianName = u.FullName,

                ActiveTasks = _context.TechnicianAssignments
                    .Count(a =>
                        a.TechnicianId == u.UserId &&
                        a.ServiceRequest.Status != "Completed"
                    )
            })
            .ToListAsync();
    }

    // ===================== ASSIGN TECHNICIAN =====================
    public async Task<AssignableServiceRequestDto?> AssignTechnicianAsync(
        int serviceRequestId,
        AssignTechnicianDto dto)
    {
        var request = await _context.ServiceRequests
            .Include(r => r.TechnicianAssignments)
            .FirstOrDefaultAsync(r => r.ServiceRequestId == serviceRequestId);

        if (request == null)
            return null;

        var assignment = request.TechnicianAssignments.FirstOrDefault();

        if (assignment == null)
        {
            assignment = new TechnicianAssignment
            {
                ServiceRequestId = serviceRequestId,
                TechnicianId = dto.TechnicianId,
                AssignedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Status = "Assigned"
            };

            _context.TechnicianAssignments.Add(assignment);
        }
        else
        {
            assignment.TechnicianId = dto.TechnicianId;
        }

        request.ScheduledDate = dto.ScheduledDate;
        request.Status = "Assigned";

        await _context.SaveChangesAsync();

        // Return updated card data for frontend
        return await _context.ServiceRequests
            .Include(r => r.Service)
                .ThenInclude(s => s.ServiceCategory)
            .Include(r => r.Customer)
            .Include(r => r.TechnicianAssignments)
                .ThenInclude(a => a.Technician)
            .Where(r => r.ServiceRequestId == serviceRequestId)
            .Select(r => new AssignableServiceRequestDto
            {
                ServiceRequestId = r.ServiceRequestId,
                CustomerId = r.CustomerId,
                ServiceName = r.Service.ServiceName,
                ServiceCategory = r.Service.ServiceCategory.CategoryName,
                CustomerName = r.Customer.FullName,
                IssueDescription=r.IssueDescription,
                RequestedDate = r.RequestedDate,
                ScheduledDate = r.ScheduledDate,
                Status = r.Status,
                TechnicianId = r.TechnicianAssignments
                    .Select(a => (int?)a.TechnicianId)
                    .FirstOrDefault(),
                TechnicianName = r.TechnicianAssignments
                    .Select(a => a.Technician.FullName)
                    .FirstOrDefault()
            })
            .FirstAsync();
    }
    // ===================== MONITOR REQUESTS =====================
    public async Task<List<MonitorServiceRequestDto>> GetMonitorRequestsAsync()
    {
        return await _context.ServiceRequests
            .Include(r => r.Service)
                .ThenInclude(s => s.ServiceCategory)
            .Include(r => r.Customer)
            .Include(r => r.TechnicianAssignments)
                .ThenInclude(a => a.Technician)
            
            .Select(r => new MonitorServiceRequestDto
            {
                ServiceRequestId = r.ServiceRequestId,
                ServiceName = r.Service.ServiceName,
                ServiceCategory = r.Service.ServiceCategory.CategoryName,
                CustomerName = r.Customer.FullName,

                IssueDescription = r.IssueDescription, 

                TechnicianName = r.TechnicianAssignments
                    .Select(a => a.Technician.FullName)
                    .FirstOrDefault(),

                Status = r.Status,
                RequestedDate = r.RequestedDate,
                ScheduledDate = r.ScheduledDate,
                CompletedDate = r.CompletedDate,
                Remarks=r.TechnicianAssignments
                    .Select(a=>a.Remarks)
                    .FirstOrDefault()
            })
            .OrderByDescending(r => r.RequestedDate)
            .ToListAsync();
    }


}
