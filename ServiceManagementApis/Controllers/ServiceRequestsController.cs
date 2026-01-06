using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs.Customer;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using System.Security.Claims;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/service-requests")]
[Authorize(Roles = "Customer")]
public class ServiceRequestsController : ControllerBase
{
    private readonly IServiceRequestRepository _requestRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public ServiceRequestsController(
        IServiceRequestRepository requestRepository,
        IServiceRepository serviceRepository,
        INotificationRepository notificationRepository,
        IUserRepository userRepository)
    {
        _requestRepository = requestRepository;
        _serviceRepository = serviceRepository;
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceRequestDto dto)
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var service = await _serviceRepository.GetActiveByIdAsync(dto.ServiceId);
        if (service == null)
            return BadRequest("Selected service is no longer available");

        var request = new ServiceRequest
        {
            CustomerId = customerId,
            ServiceId = dto.ServiceId,
            IssueDescription = dto.IssueDescription,
            Priority = dto.Priority,
            RequestedDate = dto.RequestedDate,
            Status = "Pending",
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        await _requestRepository.AddAsync(request);

        await _notificationRepository.AddAsync(new Notification
        {
            UserId = customerId,
            Title = "Service Request Created",
            Message = $"Your service request for '{service.ServiceName}' has been successfully submitted."
        });
        var serviceManagerIds = await _userRepository
        .GetUserIdsByRoleAsync("ServiceManager");

        foreach (var managerId in serviceManagerIds)
        {
            await _notificationRepository.AddAsync(new Notification
            {
                UserId = managerId,
                Title = "New Service Request",
                Message = $"A new service request for '{service.ServiceName}' is pending for assignment."
            });
        }

        await _notificationRepository.SaveAsync();

        return Ok(new { message = "Service request created successfully" });
    }

    
    [HttpGet("my")]
    public async Task<IActionResult> GetMyRequests()
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var requests = await _requestRepository.GetByCustomerIdAsync(customerId);



        var result = requests.Select(sr =>
        {
            var technicianAssignment = sr.TechnicianAssignments
                .FirstOrDefault(a =>
                    a.Status == "Assigned" ||
                    a.Status == "Completed"
                );

            return new ServiceRequestListDto
            {
                ServiceRequestId = sr.ServiceRequestId,
                ServiceName = sr.Service.ServiceName,
                CategoryName = sr.Service.ServiceCategory.CategoryName,
                IssueDescription = sr.IssueDescription,
                RequestedDate = sr.RequestedDate,
                ScheduledDate = sr.ScheduledDate,
                Priority = sr.Priority,
                Status = sr.Status,
                CreatedAt = sr.CreatedAt,
                
                TechnicianName = technicianAssignment?.Technician.FullName,
                Remarks = technicianAssignment?.Remarks
            };
        });


        return Ok(result);
    }

    
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null || request.CustomerId != customerId)
            return NotFound("Service request not found");

        request.Status = "Cancelled";
        await _requestRepository.SaveAsync();

        
        await _notificationRepository.AddAsync(new Notification
        {
            UserId = customerId,
            Title = "Service Request Cancelled",
            Message = "Your service request has been cancelled."
        });

        await _notificationRepository.SaveAsync();

        return Ok(new { message = "Service request cancelled" });
    }

    
    [HttpPut("{id}/update-requested-date")]
    public async Task<IActionResult> UpdateRequestedDate(
        int id,
        UpdateRequestedDateDto dto)
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null || request.CustomerId != customerId)
            return NotFound();

        if (request.Status != "Pending" && request.Status != "Rescheduled")
            return BadRequest("Cannot change date after assignment");

        request.RequestedDate = dto.RequestedDate;
        request.Status = "Pending";
        await _requestRepository.SaveAsync();

        
        await _notificationRepository.AddAsync(new Notification
        {
            UserId = customerId,
            Title = "Service Request Updated",
            Message = "Your requested service date has been updated."
        });

        await _notificationRepository.SaveAsync();

        return Ok(new { message = "Requested date updated" });
    }

    
    [HttpPut("{id}/update-issue")]
    public async Task<IActionResult> UpdateIssue(int id, UpdateIssueDescriptionDto dto)
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null || request.CustomerId != customerId)
            return NotFound("Service request not found");

        if (request.Status != "Pending" && request.Status != "Rescheduled")
            return BadRequest("Issue description cannot be updated at this stage");

        request.IssueDescription = dto.IssueDescription;
        await _requestRepository.SaveAsync();

        // 🔔 Notification
        await _notificationRepository.AddAsync(new Notification
        {
            UserId = customerId,
            Title = "Service Request Updated",
            Message = "Issue description has been updated."
        });

        await _notificationRepository.SaveAsync();

        return Ok(new { message = "Issue description updated successfully" });
    }
}
