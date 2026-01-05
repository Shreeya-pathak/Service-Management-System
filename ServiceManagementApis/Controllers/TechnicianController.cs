using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs.Technician;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using System.Security.Claims;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/technician")]
[Authorize(Roles = "Technician")]
public class TechnicianController : ControllerBase
{
    private readonly ITechnicianRepository _repo;
    private readonly INotificationRepository _notificationRepo;
    public TechnicianController(ITechnicianRepository repo, INotificationRepository notificationRepo)
    {
        _repo = repo;
        _notificationRepo = notificationRepo;
    }

    private int TechnicianId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ---------------- DASHBOARD ----------------
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        return Ok(await _repo.GetDashboardAsync(TechnicianId));
    }

    // ---------------- ASSIGNED REQUESTS ----------------
    [HttpGet("requests")]
    public async Task<IActionResult> AssignedRequests()
    {
        return Ok(await _repo.GetAssignedRequestsAsync(TechnicianId));
    }

    // ---------------- UPDATE REQUEST STATUS ----------------
    [HttpPut("requests/{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateRequestStatusDto dto)
    {
        var success = await _repo.UpdateRequestStatusAsync(id, dto.Status, dto.CompletedDate);
        if (!success) return NotFound("Service request not found");
        var customerId = await _repo.GetCustomerIdByRequestIdAsync(id);
        var serviceName = await _repo.GetServiceNameByRequestIdAsync(id);

        if (customerId != null)
        {
            await _notificationRepo.AddAsync(new Notification
            {
                UserId = customerId.Value,
                Title = "Service Status Updated",
                Message = serviceName != null
                    ? $"Your service request for '{serviceName}' status is now '{dto.Status}'."
                    : $"Your service request status is now '{dto.Status}'."
            });

            await _notificationRepo.SaveAsync();
        }
        return Ok(new { message = "Status updated successfully" });
    }

    // ---------------- UPDATE AVAILABILITY ----------------
    [HttpPut("availability")]
    public async Task<IActionResult> UpdateAvailability(UpdateAvailabilityDto dto)
    {
        var success = await _repo.UpdateAvailabilityAsync(TechnicianId, dto.AvailabilityStatus);
        if (!success) return NotFound();

        return Ok(new { message = "Availability updated" });
    }
}
