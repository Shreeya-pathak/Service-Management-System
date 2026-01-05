using ServiceManagementApis.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace ServiceManagementApis.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        // Ensure DB & migrations are applied
        context.Database.Migrate();

        // =====================================================
        // USERS (ONLY if they don't already exist)
        // =====================================================

        if (!context.Users.Any(u =>
            u.Role.RoleName == "Customer" ||
            u.Role.RoleName == "Technician" ||
            u.Role.RoleName == "ServiceManager"))
        {
            var customerRole = context.Roles.First(r => r.RoleName == "Customer");
            var technicianRole = context.Roles.First(r => r.RoleName == "Technician");
            var managerRole = context.Roles.First(r => r.RoleName == "ServiceManager");

            var users = new List<User>();

            // ---------- 5 Customers ----------
            for (int i = 1; i <= 5; i++)
            {
                users.Add(new User
                {
                    FullName = $"Customer {i}",
                    Email = $"customer{i}@sms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                    RoleId = customerRole.RoleId,
                    IsActive = true,
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
                });
            }

            // ---------- 2 Technicians ----------
            for (int i = 1; i <= 2; i++)
            {
                users.Add(new User
                {
                    FullName = $"Technician {i}",
                    Email = $"technician{i}@sms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Tech@123"),
                    RoleId = technicianRole.RoleId,
                    IsActive = true,
                    AvailabilityStatus = "Available",
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
                });
            }

            // ---------- 1 Service Manager ----------
            users.Add(new User
            {
                FullName = "Service Manager",
                Email = "manager@sms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"),
                RoleId = managerRole.RoleId,
                IsActive = true,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            });

            context.Users.AddRange(users);
            context.SaveChanges();
        }

        // =====================================================
        // SERVICE CATEGORIES (ONLY if empty)
        // =====================================================

        if (!context.ServiceCategories.Any())
        {
            context.ServiceCategories.AddRange(
                new ServiceCategory { CategoryName = "Installation", IsActive = true },
                new ServiceCategory { CategoryName = "Repair", IsActive = true },
                new ServiceCategory { CategoryName = "Maintenance", IsActive = true }
            );

            context.SaveChanges();
        }

        // =====================================================
        // SERVICES (ONLY if none exist)
        // =====================================================

        if (!context.Services.Any())
        {
            var installation = context.ServiceCategories.First(c => c.CategoryName == "Installation");
            var repair = context.ServiceCategories.First(c => c.CategoryName == "Repair");
            var maintenance = context.ServiceCategories.First(c => c.CategoryName == "Maintenance");

            context.Services.AddRange(

                // -------- Installation --------
                new Service
                {
                    ServiceName = "AC Installation",
                    ServiceCategoryId = installation.ServiceCategoryId,
                    Price = 2500,
                    SLAHours = 48,
                    Description = "Professional air conditioner installation"
                },
                new Service
                {
                    ServiceName = "Washing Machine Installation",
                    ServiceCategoryId = installation.ServiceCategoryId,
                    Price = 1800,
                    SLAHours = 48,
                    Description = "Installation of washing machines"
                },
                new Service
                {
                    ServiceName = "RO System Installation",
                    ServiceCategoryId = installation.ServiceCategoryId,
                    Price = 1500,
                    SLAHours = 24,
                    Description = "RO water purifier installation"
                },

                // -------- Repair --------
                new Service
                {
                    ServiceName = "AC Repair",
                    ServiceCategoryId = repair.ServiceCategoryId,
                    Price = 1200,
                    SLAHours = 24,
                    Description = "Diagnosis and repair of air conditioners"
                },
                new Service
                {
                    ServiceName = "Refrigerator Repair",
                    ServiceCategoryId = repair.ServiceCategoryId,
                    Price = 1000,
                    SLAHours = 24,
                    Description = "Refrigerator fault repair"
                },
                new Service
                {
                    ServiceName = "Washing Machine Repair",
                    ServiceCategoryId = repair.ServiceCategoryId,
                    Price = 900,
                    SLAHours = 24,
                    Description = "Repair of washing machines"
                },

                // -------- Maintenance --------
                new Service
                {
                    ServiceName = "Annual AC Maintenance",
                    ServiceCategoryId = maintenance.ServiceCategoryId,
                    Price = 3500,
                    SLAHours = 72,
                    Description = "Complete yearly AC maintenance"
                },
                new Service
                {
                    ServiceName = "Electrical Maintenance",
                    ServiceCategoryId = maintenance.ServiceCategoryId,
                    Price = 2000,
                    SLAHours = 72,
                    Description = "Routine electrical maintenance"
                },
                new Service
                {
                    ServiceName = "Plumbing Maintenance",
                    ServiceCategoryId = maintenance.ServiceCategoryId,
                    Price = 2200,
                    SLAHours = 72,
                    Description = "Routine plumbing system maintenance"
                }
            );

            context.SaveChanges();
        }
    }
}
