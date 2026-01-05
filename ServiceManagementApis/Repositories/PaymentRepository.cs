using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.PaymentRepositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<Payment>> GetAllAsync()
    {
        return await _context.Payments
            .Include(p => p.Invoice)
                .ThenInclude(i => i.ServiceRequest)
                    .ThenInclude(sr => sr.Customer)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }


    public async Task AddAsync(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
    }
}

