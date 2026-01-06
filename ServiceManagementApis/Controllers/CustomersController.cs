using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.DTOs.Customer;
using ServiceManagementApis.Repositories.Interfaces;
using System.Security.Claims;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Customer")]
public class CustomersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public CustomersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return NotFound();

        var dto = new MyProfileDto
        {
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.RoleName,
            CreatedAt = user.CreatedAt
        };

        return Ok(dto);
    }

    
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(UpdateMyProfileDto dto)
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return NotFound();

        user.FullName = dto.FullName;
        user.PhoneNumber = dto.PhoneNumber;

        await _userRepository.UpdateAsync(user);

        return Ok(new { message = "Profile updated successfully" });
    }
    
    [HttpDelete("me")]
    public async Task<IActionResult> DeactivateMyAccount()
    {
        int userId = int.Parse(
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
        );

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return NotFound();

        // Soft delete
        user.IsActive = false;

        await _userRepository.UpdateAsync(user);

        return Ok(new { message = "Account deactivated successfully" });
    }

}
