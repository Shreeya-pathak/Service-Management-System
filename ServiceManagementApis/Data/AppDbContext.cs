using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Models;

namespace ServiceManagementApis.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

  
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }

    public DbSet<ServiceCategory> ServiceCategories { get; set; }
    public DbSet<Service> Services { get; set; }

    public DbSet<ServiceRequest> ServiceRequests { get; set; }
    public DbSet<TechnicianAssignment> TechnicianAssignments { get; set; }

    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Notification> Notifications { get; set; }


    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        
        modelBuilder.Entity<TechnicianAssignment>()
            .HasKey(t => t.AssignmentId);

        
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        
        modelBuilder.Entity<User>()
            .HasOne(u => u.RequestedRole)
            .WithMany()
            .HasForeignKey(u => u.RequestedRoleId)
            .OnDelete(DeleteBehavior.Restrict);

        
        modelBuilder.Entity<Service>()
            .HasOne(s => s.ServiceCategory)
            .WithMany(c => c.Services)
            .HasForeignKey(s => s.ServiceCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

       
        modelBuilder.Entity<ServiceRequest>()
            .HasOne(sr => sr.Customer)
            .WithMany()
            .HasForeignKey(sr => sr.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        
        modelBuilder.Entity<ServiceRequest>()
            .HasOne(sr => sr.Service)
            .WithMany()
            .HasForeignKey(sr => sr.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        
        modelBuilder.Entity<TechnicianAssignment>()
            .HasOne(ta => ta.ServiceRequest)
            .WithMany()
            .HasForeignKey(ta => ta.ServiceRequestId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<TechnicianAssignment>()
        .HasOne(t => t.ServiceRequest)
        .WithMany(r => r.TechnicianAssignments)
        .HasForeignKey(t => t.ServiceRequestId)
        .OnDelete(DeleteBehavior.Restrict);
    

    
    modelBuilder.Entity<TechnicianAssignment>()
            .HasOne(ta => ta.Technician)
            .WithMany()
            .HasForeignKey(ta => ta.TechnicianId)
            .OnDelete(DeleteBehavior.Restrict);

        
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.ServiceRequest)
            .WithOne()
            .HasForeignKey<Invoice>(i => i.ServiceRequestId)
            .OnDelete(DeleteBehavior.Restrict);
        
        
        modelBuilder.Entity<Address>()
            .HasOne(a => a.User)
            .WithMany(u => u.Addresses)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);



        
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Invoice)
            .WithMany()
            .HasForeignKey(p => p.InvoiceId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Service>()
            .Property(s => s.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.AmountPaid)
            .HasPrecision(18, 2);

        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "Customer" },
            new Role { RoleId = 3, RoleName = "Technician" },
            new Role { RoleId = 4, RoleName = "ServiceManager" },
            new Role { RoleId = 5, RoleName = "Pending" } 
        );

        
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                FullName = "System Admin",
                Email = "admin@system.com",
                PasswordHash = "$2a$11$Bp./J1yPqnK870SsArh3x.U7qwiIQvjW4/gufPCuVR3ieuJ4ZwGy6",
                PhoneNumber = "9999999999",
                RoleId = 1,          // Admin
                RequestedRoleId = null,
                IsActive = true,
                CreatedAt = new DateOnly(2025, 1, 1)
            }
        );
    }
}
