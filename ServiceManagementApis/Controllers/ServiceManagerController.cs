using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.DTOs.ServiceManager;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/service-manager")]
[Authorize(Roles = "ServiceManager")]
public class ServiceManagerController : ControllerBase
{
    private readonly IServiceManagerRepository _repo;
    private readonly INotificationRepository _notificationRepo;

    public ServiceManagerController(IServiceManagerRepository repo, INotificationRepository notificationRepo)
    {
        _repo = repo;
        _notificationRepo = notificationRepo;
    }

    
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        return Ok(await _repo.GetDashboardAsync());
    }

    
    [HttpGet("requests")]
    public async Task<IActionResult> AssignableRequests()
    {
        return Ok(await _repo.GetAssignableRequestsAsync());
    }

    
    [HttpGet("technicians")]
    public async Task<IActionResult> AvailableTechnicians()
    {
        return Ok(await _repo.GetAvailableTechniciansAsync());
    }

    
    
    [HttpPut("requests/{id}/assign")]
    public async Task<IActionResult> AssignTechnician(
        int id,
        AssignTechnicianDto dto)
    {
        var result = await _repo.AssignTechnicianAsync(id, dto);

        if (result == null)
            return NotFound("Service request not found");
        await _notificationRepo.AddAsync(new Notification
        {
            UserId = result.CustomerId,
            Title = "Technician Assigned",
            Message = $"Technician '{result.TechnicianName}' has been assigned to your service request '{result.ServiceName}'."
        });

        
        await _notificationRepo.AddAsync(new Notification
        {
            UserId = dto.TechnicianId,
            Title = "New Service Assignment",
            Message = $"You have been assigned a new service request for '{result.ServiceName}'."
        });
        await _notificationRepo.SaveAsync();
        
        return Ok(result);
    }


    
    [HttpGet("monitor-requests")]
    public async Task<IActionResult> MonitorRequests()
    {
        return Ok(await _repo.GetMonitorRequestsAsync());
    }

}
