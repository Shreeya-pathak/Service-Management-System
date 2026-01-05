using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ServiceManagementApis.Controllers;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.Auth;
using ServiceManagementApis.Models;
using System;
using System.Data;
using Xunit;

namespace ServiceManagementApis.Tests.Controllers;

public class AuthControllerTests
{
    private readonly AppDbContext _context;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        // ---------------------------
        // In-Memory DB setup
        // ---------------------------
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        // ---------------------------
        // Seed roles
        // ---------------------------
        _context.Roles.AddRange(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "Customer" },
            new Role { RoleId = 3, RoleName = "Pending" }
        );
        _context.SaveChanges();

        // ---------------------------
        // Fake JWT config
        // ---------------------------
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Key", "THIS_IS_A_VERY_LONG_TEST_JWT_SECRET_KEY_1234567890" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" },
                { "Jwt:ExpiryMinutes", "60" }
            })
            .Build();

        _controller = new AuthController(_context, config);
    }

    // --------------------------------------------------
    // REGISTER TESTS
    // --------------------------------------------------

    [Fact]
    public async Task Register_NewCustomer_ReturnsOk()
    {
        var dto = new RegisterDto
        {
            FullName = "Test User",
            Email = "test@example.com",
            Password = "Password@123",
            RoleName = "Customer"
        };

        var result = await _controller.Register(dto);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
    {
        _context.Users.Add(new User
        {
            FullName = "Existing",
            Email = "dup@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("pass"),
            RoleId = 2,
            IsActive = true,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        });
        _context.SaveChanges();

        var dto = new RegisterDto
        {
            FullName = "Test",
            Email = "dup@example.com",
            Password = "Password@123",
            RoleName = "Customer"
        };

        var result = await _controller.Register(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_InvalidRole_ReturnsBadRequest()
    {
        var dto = new RegisterDto
        {
            FullName = "Test",
            Email = "role@test.com",
            Password = "Password@123",
            RoleName = "InvalidRole"
        };

        var result = await _controller.Register(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    // --------------------------------------------------
    // LOGIN TESTS
    // --------------------------------------------------

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        var role = _context.Roles.First(r => r.RoleName == "Customer");

        _context.Users.Add(new User
        {
            FullName = "Login User",
            Email = "login@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
            RoleId = role.RoleId,
            Role = role,
            IsActive = true,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        });
        _context.SaveChanges();

        var dto = new LoginDto
        {
            Email = "login@test.com",
            Password = "Password@123"
        };

        var result = await _controller.Login(dto);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        var role = _context.Roles.First(r => r.RoleName == "Customer");

        _context.Users.Add(new User
        {
            FullName = "Wrong Pass",
            Email = "wrong@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPass"),
            RoleId = role.RoleId,
            Role = role,
            IsActive = true,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        });
        _context.SaveChanges();

        var dto = new LoginDto
        {
            Email = "wrong@test.com",
            Password = "WrongPass"
        };

        var result = await _controller.Login(dto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_InactiveUser_ReturnsUnauthorized()
    {
        var role = _context.Roles.First(r => r.RoleName == "Customer");

        _context.Users.Add(new User
        {
            FullName = "Inactive",
            Email = "inactive@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
            RoleId = role.RoleId,
            Role = role,
            IsActive = false,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        });
        _context.SaveChanges();

        var dto = new LoginDto
        {
            Email = "inactive@test.com",
            Password = "Password@123"
        };

        var result = await _controller.Login(dto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
