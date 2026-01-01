using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // ---------------- REGISTER ----------------
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email already exists");

        var selectedRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.RoleName == dto.RoleName);

        if (selectedRole == null)
            return BadRequest("Invalid role selected");

        var pendingRole = await _context.Roles
            .FirstAsync(r => r.RoleName == "Pending");

        bool isCustomer = dto.RoleName == "Customer";

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PhoneNumber = null,
            IsActive = true,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),

            // 🔥 CORE FIX
            RoleId = isCustomer
                ? selectedRole.RoleId     // Customer → immediate access
                : pendingRole.RoleId,     // Others → Pending

            RequestedRoleId = isCustomer
                ? null
                : selectedRole.RoleId     // Store requested role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(isCustomer
            ? "Registered successfully as Customer"
            : "Registered successfully. Await admin approval");
    }

    // ---------------- LOGIN ----------------
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if (user == null)
            return Unauthorized("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.RoleName)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpiryMinutes"])
            ),
            signingCredentials: new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            role = user.Role.RoleName,
            approvalStatus = user.Role.RoleName == "Pending"
                ? "Pending"
                : "Approved"
        });
    }
}
