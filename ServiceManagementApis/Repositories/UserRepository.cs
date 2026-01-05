using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.Admin;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // 🔹 Manage Users list (NON-pending only)
    public async Task<List<UserListDto>> GetAllNonPendingUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .Where(u => u.RequestedRoleId == null)
            .Select(u => new UserListDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                RoleName = u.Role.RoleName,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    // 🔹 Enable / Disable
    public async Task<bool> ToggleUserStatusAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return false;

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    public async Task<List<int>> GetUserIdsByRoleAsync(string roleName)
    {
        return await _context.Users
            .Where(u =>
                u.Role.RoleName == roleName &&
                u.IsActive
            )
            .Select(u => u.UserId)
            .ToListAsync();
    }

}
