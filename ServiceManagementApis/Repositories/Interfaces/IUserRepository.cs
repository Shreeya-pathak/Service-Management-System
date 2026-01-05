using ServiceManagementApis.DTOs.Admin;
using ServiceManagementApis.Models;

namespace ServiceManagementApis.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<UserListDto>> GetAllNonPendingUsersAsync();
    Task<bool> ToggleUserStatusAsync(int userId);
    Task<User?> GetByIdAsync(int userId);
    Task UpdateAsync(User user);
    Task<List<int>> GetUserIdsByRoleAsync(string roleName);

}
