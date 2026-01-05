using ServiceManagementApis.Models;

namespace ServiceManagementApis.DTOs
{
    public class PaymentHistoryDto
    {
        public int PaymentId { get; set; }
        public int InvoiceId { get; set; }
        public string CustomerName { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; } = null!;
    }

}
