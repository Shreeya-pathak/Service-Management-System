using Microsoft.AspNetCore.Mvc;
using Moq;
using ServiceManagementApis.Controllers;
using ServiceManagementApis.DTOs.Admin;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using Xunit;

namespace ServiceManagementApis.Tests.Controllers;

public class ServiceCategoriesControllerTests
{
    private readonly Mock<IServiceCategoryRepository> _repoMock;
    private readonly ServiceCategoriesController _controller;

    public ServiceCategoriesControllerTests()
    {
        _repoMock = new Mock<IServiceCategoryRepository>();
        _controller = new ServiceCategoriesController(_repoMock.Object);
    }

    // --------------------------------------------------
    // GET ALL
    // --------------------------------------------------
    [Fact]
    public async Task GetAll_ReturnsOk()
    {
        _repoMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<ServiceCategory>());

        var result = await _controller.GetAll();

        Assert.IsType<OkObjectResult>(result);
    }

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------
    [Fact]
    public async Task Create_Category_ReturnsOk()
    {
        var dto = new CreateServiceCategoryDto
        {
            CategoryName = "Installation"
        };

        _repoMock.Setup(r => r.AddAsync(It.IsAny<ServiceCategory>()))
            .Returns(Task.CompletedTask);

        var result = await _controller.Create(dto);

        Assert.IsType<OkObjectResult>(result);
    }

    // --------------------------------------------------
    // UPDATE – INVALID ID
    // --------------------------------------------------
    [Fact]
    public async Task Update_InvalidId_ReturnsNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((ServiceCategory?)null);

        var dto = new UpdateServiceCategoryDto
        {
            CategoryName = "Updated"
        };

        var result = await _controller.Update(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // --------------------------------------------------
    // DISABLE
    // --------------------------------------------------
    [Fact]
    public async Task Disable_Category_ReturnsOk()
    {
        var category = new ServiceCategory
        {
            ServiceCategoryId = 1,
            CategoryName = "Repair",
            IsActive = true
        };

        _repoMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(category);

        _repoMock.Setup(r => r.UpdateAsync(category))
            .Returns(Task.CompletedTask);

        var result = await _controller.Disable(1);

        Assert.IsType<OkObjectResult>(result);
    }

    // --------------------------------------------------
    // ENABLE
    // --------------------------------------------------
    [Fact]
    public async Task Enable_Category_ReturnsOk()
    {
        var category = new ServiceCategory
        {
            ServiceCategoryId = 1,
            CategoryName = "Repair",
            IsActive = false
        };

        _repoMock.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(category);

        _repoMock.Setup(r => r.UpdateAsync(category))
            .Returns(Task.CompletedTask);

        var result = await _controller.Enable(1);

        Assert.IsType<OkObjectResult>(result);
    }
}
