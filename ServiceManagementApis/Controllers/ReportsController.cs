using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.Reports;
using ServiceManagementApis.Services;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _service;
    private readonly AppDbContext _context;
    public ReportsController(IReportService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet("monthly-revenue")]
    [Authorize(Roles = "Admin,ServiceManager")]
    public async Task<IActionResult> GetMonthlyRevenue(
        [FromQuery] int year,
        [FromQuery] int month)
    {
        var report = await _service.GetMonthlyRevenueAsync(year, month);
        return Ok(report);
    }
    [Authorize(Roles = "Admin,ServiceManager")]
    [HttpGet("technician-workload")]
    public IActionResult GetTechnicianWorkload()
    {
        var data = _context.TechnicianAssignments
            .Include(t => t.Technician)
            .Include(t => t.ServiceRequest)
            .Where(t =>
                t.ServiceRequest.Status == "Assigned" ||
                t.ServiceRequest.Status == "In Progress"
            )

            .GroupBy(t => new
            {
                t.TechnicianId,
                t.Technician.FullName
            })
            .Select(g => new TechnicianWorkloadDto
            {
                TechnicianId = g.Key.TechnicianId,
                TechnicianName = g.Key.FullName,
                ActiveRequestCount = g.Count()
            })
            .OrderByDescending(x => x.ActiveRequestCount)
            .ToList();

        return Ok(data);
    }
    [Authorize(Roles = "Admin,ServiceManager")]
    [HttpGet("average-resolution-time")]
    public IActionResult GetAverageResolutionTime()
    {
        var resolvedRequests = _context.ServiceRequests
            .Where(sr =>
                (sr.Status == "Completed" || sr.Status == "Closed") &&
                sr.CompletedDate != null
            )
            .AsEnumerable() // IMPORTANT
            .Select(sr =>
                sr.CompletedDate!.Value.DayNumber -
                sr.RequestedDate.DayNumber
            );

        var result = new AverageResolutionTimeDto
        {
            AverageDays = resolvedRequests.Any()
                ? Math.Round(resolvedRequests.Average(), 2)
                : 0,

            TotalResolvedRequests = resolvedRequests.Count()
        };

        return Ok(result);
    }
    
    [Authorize(Roles = "Admin,ServiceManager")]
    [HttpGet("service-requests/by-status")]
    public IActionResult GetServiceRequestsByStatus()
    {
        var data = _context.ServiceRequests
            .GroupBy(sr => sr.Status)
            .Select(g => new ServiceRequestStatusReportDto
            {
                Status = g.Key,
                Count = g.Count()
            })
            .ToList();

        return Ok(data);
    }

    [Authorize(Roles = "Admin,ServiceManager")]
    [HttpGet("service-requests/by-category")]
    public IActionResult GetServiceRequestsByCategory()
    {
        var data = _context.ServiceRequests
            .Include(sr => sr.Service)
                .ThenInclude(s => s.ServiceCategory)
            .GroupBy(sr => sr.Service.ServiceCategory.CategoryName)
            .Select(g => new ServiceRequestCategoryReportDto
            {
                CategoryName = g.Key,
                Count = g.Count()
            })
            .ToList();

        return Ok(data);
    }


}

