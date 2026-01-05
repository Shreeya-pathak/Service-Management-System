namespace ServiceManagementApis.DTOs.Reports
{
    public class MonthlyRevenueDto
    {
        public int Year { get; set; }
        public int Month { get; set; }

        public decimal TotalRevenue { get; set; }
        public int TotalPayments { get; set; }
    }

}
