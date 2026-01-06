using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs.Admin;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/service-categories")]
[Authorize]
public class ServiceCategoriesController : ControllerBase
{
    private readonly IServiceCategoryRepository _categoryRepository;

    public ServiceCategoriesController(IServiceCategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryRepository.GetAllAsync();

        var result = categories.Select(c => new
        {
            c.ServiceCategoryId,
            c.CategoryName,
            c.IsActive
        });

        return Ok(result);
    }
    [HttpGet("active")]
    [AllowAnonymous] // or [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetActive()
    {
        var categories = await _categoryRepository.GetActiveAsync();

        var result = categories.Select(c => new
        {
            c.ServiceCategoryId,
            c.CategoryName
        });

        return Ok(result);
    }


    
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceCategoryDto dto)
    {
        var category = new ServiceCategory
        {
            CategoryName = dto.CategoryName
        };

        await _categoryRepository.AddAsync(category);
        return Ok(new { message = "Service Category created successfully" });

    }

    
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateServiceCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            return NotFound("Category not found");

        category.CategoryName = dto.CategoryName;

        await _categoryRepository.UpdateAsync(category);
        return Ok(new { message = "Service category created successfully" });

    }

    
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/disable")]
    public async Task<IActionResult> Disable(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            return NotFound("Category not found");

        category.IsActive = false;
        await _categoryRepository.UpdateAsync(category);

        return Ok(new { message = "Category disabled successfully" });
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/enable")]
    public async Task<IActionResult> Enable(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            return NotFound("Category not found");

        category.IsActive = true;
        await _categoryRepository.UpdateAsync(category);

        return Ok(new { message = "Category enabled successfully" });
    }



}
