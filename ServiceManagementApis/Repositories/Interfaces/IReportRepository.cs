using ServiceManagementApis.DTOs.Reports;

namespace ServiceManagementApis.Repositories.Interfaces
{
    public interface IReportRepository
    {
        Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int year, int month);
    }

}
