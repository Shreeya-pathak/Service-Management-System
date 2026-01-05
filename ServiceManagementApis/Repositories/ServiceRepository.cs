using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Repositories;

public class ServiceRepository : IServiceRepository
{
    private readonly AppDbContext _context;

    public ServiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Service>> GetAllAsync()
    {
        return await _context.Services
            .Include(s => s.ServiceCategory)
            .ToListAsync();
    }

    public async Task<List<Service>> GetByCategoryAsync(int categoryId)
    {
        return await _context.Services
            .Where(s => s.ServiceCategoryId == categoryId)
            .ToListAsync();
    }

    public async Task<Service?> GetByIdAsync(int id)
    {
        return await _context.Services.FindAsync(id);
    }

    public async Task AddAsync(Service service)
    {
        _context.Services.Add(service);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Service service)
    {
        _context.Services.Update(service);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Service service)
    {
        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsServiceInUseAsync(int serviceId)
    {
        return await _context.ServiceRequests
            .AnyAsync(sr => sr.ServiceId == serviceId);
    }
    public async Task<List<Service>> GetActiveByCategoryAsync(int categoryId)
    {
        return await _context.Services
            .Include(s => s.ServiceCategory)
            .Where(s =>
                s.ServiceCategoryId == categoryId &&
                s.IsActive &&
                s.ServiceCategory.IsActive)
            .ToListAsync();
    }

    public async Task<Service?> GetActiveByIdAsync(int id)
    {
        return await _context.Services
            .Include(s => s.ServiceCategory)
            .Where(s =>
                s.ServiceId == id &&
                s.IsActive &&
                s.ServiceCategory.IsActive)
            .FirstOrDefaultAsync();
    }


}
