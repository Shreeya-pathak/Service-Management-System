namespace ServiceManagementApis.DTOs.InvoiceAndPayment
{
    public class InvoiceDetailsDto
    {
        public int InvoiceId { get; set; }

        // Customer
        public string CustomerName { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public string? CustomerPhone { get; set; }

        // Service
        public string ServiceName { get; set; } = null!;
        public string IssueDescription { get; set; } = null!;

        // Invoice
        public DateOnly InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = null!;
    }

}
