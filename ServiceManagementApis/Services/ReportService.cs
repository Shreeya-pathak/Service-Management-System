using ServiceManagementApis.DTOs.Reports;
using ServiceManagementApis.Repositories.Interfaces;

namespace ServiceManagementApis.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repo;

        public ReportService(IReportRepository repo)
        {
            _repo = repo;
        }

        public async Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int year, int month)
        {
            if (month < 1 || month > 12)
                throw new Exception("Invalid month");

            return await _repo.GetMonthlyRevenueAsync(year, month);
        }
    }

}
