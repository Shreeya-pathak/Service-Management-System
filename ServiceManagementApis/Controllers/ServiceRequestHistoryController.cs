using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Repositories.Interfaces;
using System.Security.Claims;

[ApiController]
[Route("api/service-requests")]
public class ServiceRequestHistoryController : ControllerBase
{
    private readonly IServiceRequestRepository _repo;

    public ServiceRequestHistoryController(IServiceRequestRepository repo)
    {
        _repo = repo;
    }

    
    [HttpGet("my-history")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> MyHistory()
    {
        int customerId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var data = await _repo.GetByCustomerIdAsync(customerId);

        var result = data.Select(sr => new ServiceRequestHistoryDto
        {
            ServiceRequestId = sr.ServiceRequestId,
            CustomerName = sr.Customer.FullName,
            ServiceName = sr.Service.ServiceName,
            IssueDescription = sr.IssueDescription,
            RequestedDate = sr.RequestedDate,
            ScheduledDate = sr.ScheduledDate,
            CompletedDate = sr.CompletedDate,
            Status = sr.Status
        });

        return Ok(result);
    }

    
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AllHistory()
    {
        var data = await _repo.GetAllAsync();

        var result = data.Select(sr => new ServiceRequestHistoryDto
        {
            ServiceRequestId = sr.ServiceRequestId,
            CustomerName = sr.Customer.FullName,
            ServiceName = sr.Service.ServiceName,
            IssueDescription = sr.IssueDescription,
            RequestedDate = sr.RequestedDate,
            ScheduledDate = sr.ScheduledDate,
            CompletedDate = sr.CompletedDate,
            Status = sr.Status
        });

        return Ok(result);
    }
}
