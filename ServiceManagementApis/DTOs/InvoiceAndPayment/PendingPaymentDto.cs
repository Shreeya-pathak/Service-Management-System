namespace ServiceManagementApis.DTOs.InvoiceAndPayment
{
    public class PendingPaymentDto
    {
        public int InvoiceId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string ServiceName { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public DateOnly InvoiceDate { get; set; }
    }
}
