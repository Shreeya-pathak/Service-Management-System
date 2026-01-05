using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs.Reports;
using ServiceManagementApis.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagementApis.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int year, int month)
        {
            var payments = await _context.Payments
                .Where(p =>
                    p.PaymentDate.Year == year &&
                    p.PaymentDate.Month == month)
                .ToListAsync();

            return new MonthlyRevenueDto
            {
                Year = year,
                Month = month,
                TotalRevenue = payments.Sum(p => p.AmountPaid),
                TotalPayments = payments.Count
            };
        }
    }
}
