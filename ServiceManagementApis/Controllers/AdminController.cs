using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.Admin;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IUserRepository _userRepository;

    public AdminController(AppDbContext context, IUserRepository userRepository)
    {
        _context = context;
        _userRepository = userRepository;
        //_userRepository = userRepository;
    }


    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllNonPendingUsersAsync();
        return Ok(users);
    }

    [HttpPatch("users/{id}/toggle-status")]
    public async Task<IActionResult> ToggleUserStatus(int id)
    {
        var result = await _userRepository.ToggleUserStatusAsync(id);

        if (!result)
            return NotFound("User not found");

        return Ok("User status updated successfully");
    }


    [HttpGet("pending-users")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var pendingUsers = await _context.Users
            .Include(u => u.RequestedRole)
            .Where(u => u.RequestedRoleId != null)
            .Select(u => new
            {
                u.UserId,
                u.FullName,
                u.Email,
                RequestedRole = u.RequestedRole!.RoleName
            })
            .ToListAsync();

        return Ok(pendingUsers);
    }

    
    [HttpPost("approve")]
    public async Task<IActionResult> ApproveUser(ApproveUserDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

        if (user == null)
            return NotFound("User not found");

        if (user.RequestedRoleId == null)
            return BadRequest("No pending role request");

        
        user.RoleId = user.RequestedRoleId.Value;
        user.RequestedRoleId = null;

        _context.Users.Update(user);   // <-- IMPORTANT
        await _context.SaveChangesAsync();

        return Ok("User approved successfully");
    }


    
    [HttpPost("reject")]
    public async Task<IActionResult> RejectUser(ApproveUserDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);

        if (user == null)
            return NotFound("User not found");

        user.RequestedRoleId = null;
        user.IsActive = false;

        await _context.SaveChangesAsync();

        return Ok("User rejected successfully");
    }
}
