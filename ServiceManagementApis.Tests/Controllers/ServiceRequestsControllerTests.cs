using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ServiceManagementApis.Controllers;
using ServiceManagementApis.DTOs.Customer;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using System.Security.Claims;
using Xunit;

namespace ServiceManagementApis.Tests.Controllers;

public class ServiceRequestsControllerTests
{
    private readonly Mock<IServiceRequestRepository> _requestRepo;
    private readonly Mock<IServiceRepository> _serviceRepo;
    private readonly Mock<INotificationRepository> _notificationRepo;
    private readonly Mock<IUserRepository> _userRepo;
    private readonly ServiceRequestsController _controller;

    public ServiceRequestsControllerTests()
    {
        _requestRepo = new Mock<IServiceRequestRepository>();
        _serviceRepo = new Mock<IServiceRepository>();
        _notificationRepo = new Mock<INotificationRepository>();
        _userRepo = new Mock<IUserRepository>();

        _controller = new ServiceRequestsController(
            _requestRepo.Object,
            _serviceRepo.Object,
            _notificationRepo.Object,
            _userRepo.Object
        );

        // 🔐 Fake logged-in Customer (UserId = 1)
        var user = new ClaimsPrincipal(new ClaimsIdentity(
            new[] { new Claim(ClaimTypes.NameIdentifier, "1") },
            "TestAuth"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    // --------------------------------------------------
    // 1️⃣ CREATE – INVALID SERVICE
    // --------------------------------------------------
    [Fact]
    public async Task Create_InvalidService_ReturnsBadRequest()
    {
        _serviceRepo.Setup(s => s.GetActiveByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Service?)null);

        var dto = new CreateServiceRequestDto
        {
            ServiceId = 99,
            IssueDescription = "Test",
            Priority = "High",
            RequestedDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    // --------------------------------------------------
    // 2️⃣ CANCEL – REQUEST NOT OWNED BY USER
    // --------------------------------------------------
    [Fact]
    public async Task Cancel_RequestNotOwnedByUser_ReturnsNotFound()
    {
        var request = new ServiceRequest
        {
            ServiceRequestId = 1,
            CustomerId = 999, // different user
            Status = "Pending"
        };

        _requestRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(request);

        var result = await _controller.Cancel(1);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // --------------------------------------------------
    // 3️⃣ UPDATE REQUESTED DATE – INVALID STATUS
    // --------------------------------------------------
    [Fact]
    public async Task UpdateRequestedDate_InvalidStatus_ReturnsBadRequest()
    {
        var request = new ServiceRequest
        {
            ServiceRequestId = 1,
            CustomerId = 1,
            Status = "Assigned"
        };

        _requestRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(request);

        var dto = new UpdateRequestedDateDto
        {
            RequestedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2))
        };

        var result = await _controller.UpdateRequestedDate(1, dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }
}
