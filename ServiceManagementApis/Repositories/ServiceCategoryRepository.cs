using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Repositories;

public class ServiceCategoryRepository : IServiceCategoryRepository
{
    private readonly AppDbContext _context;

    public ServiceCategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ServiceCategory>> GetAllAsync()
    {
        return await _context.ServiceCategories.ToListAsync();
    }

    public async Task<ServiceCategory?> GetByIdAsync(int id)
    {
        return await _context.ServiceCategories.FindAsync(id);
    }

    public async Task DeleteAsync(ServiceCategory category)
    {
        _context.ServiceCategories.Remove(category);
        await _context.SaveChangesAsync();
    }
    public async Task<bool> IsCategoryInUseAsync(int categoryId)
    {
        return await _context.Services
            .AnyAsync(s => s.ServiceCategoryId == categoryId);
    }
    public async Task<List<ServiceCategory>> GetActiveAsync()
    {
        return await _context.ServiceCategories
            .Where(c => c.IsActive)
            .ToListAsync();
    }


    public async Task AddAsync(ServiceCategory category)
    {
        _context.ServiceCategories.Add(category);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ServiceCategory category)
    {
        _context.ServiceCategories.Update(category);
        await _context.SaveChangesAsync();
    }
}
