using ServiceManagementApis.DTOs.Reports;

namespace ServiceManagementApis.Services
{
    public interface IReportService
    {
        Task<MonthlyRevenueDto> GetMonthlyRevenueAsync(int year, int month);
    }

}
