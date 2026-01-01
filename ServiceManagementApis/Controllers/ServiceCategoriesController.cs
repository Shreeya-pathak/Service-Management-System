using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/service-categories")]
[Authorize(Roles = "Admin")]
public class ServiceCategoriesController : ControllerBase
{
    private readonly IServiceCategoryRepository _categoryRepository;

    public ServiceCategoriesController(IServiceCategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    // --------------------------------------------------
    // GET: All Categories
    // --------------------------------------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryRepository.GetAllAsync();

        var result = categories.Select(c => new
        {
            c.ServiceCategoryId,
            c.CategoryName
        });

        return Ok(result);
    }

    // --------------------------------------------------
    // POST: Create Category
    // --------------------------------------------------
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

    // --------------------------------------------------
    // PUT: Update Category
    // --------------------------------------------------
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
}
