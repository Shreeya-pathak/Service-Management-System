using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/services")]
[Authorize(Roles = "Admin")]
public class ServicesController : ControllerBase
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IServiceCategoryRepository _categoryRepository;

    public ServicesController(
        IServiceRepository serviceRepository,
        IServiceCategoryRepository categoryRepository)
    {
        _serviceRepository = serviceRepository;
        _categoryRepository = categoryRepository;
    }

    // --------------------------------------------------
    // GET: All Services
    // --------------------------------------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _serviceRepository.GetAllAsync();

        var result = services.Select(s => new
        {
            s.ServiceId,
            s.ServiceName,
            s.Price,
            s.SLAHours,
            s.Description,
            s.ServiceCategoryId,
            CategoryName = s.ServiceCategory.CategoryName
        });

        return Ok(result);
    }

    // --------------------------------------------------
    // GET: Services by Category
    // --------------------------------------------------
    [HttpGet("by-category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
    {
        var services = await _serviceRepository.GetByCategoryAsync(categoryId);

        var result = services.Select(s => new
        {
            s.ServiceId,
            s.ServiceName,
            s.Price,
            s.SLAHours,
            s.Description
        });

        return Ok(result);
    }

    // --------------------------------------------------
    // POST: Create Service
    // --------------------------------------------------
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(dto.ServiceCategoryId);
        if (category == null)
            return BadRequest("Invalid service category");

        var service = new Service
        {
            ServiceName = dto.ServiceName,
            Price = dto.Price,
            SLAHours = dto.SLAHours,
            Description = dto.Description,
            ServiceCategoryId = dto.ServiceCategoryId
        };

        await _serviceRepository.AddAsync(service);
        return Ok(new { message = "Service created successfully" });

    }

    // --------------------------------------------------
    // PUT: Update Service
    // --------------------------------------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateServiceDto dto)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
            return NotFound("Service not found");

        service.ServiceName = dto.ServiceName;
        service.Price = dto.Price;
        service.SLAHours = dto.SLAHours;
        service.Description = dto.Description;
        service.ServiceCategoryId = dto.ServiceCategoryId;

        await _serviceRepository.UpdateAsync(service);
        return Ok(new { message = "Service updated successfully" });

    }
}
