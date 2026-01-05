namespace ServiceManagementApis.DTOs.InvoiceAndPayment
{
    public class InvoiceDetailsDto
    {
        public int InvoiceId { get; set; }

      
        public string CustomerName { get; set; } = null!;
        
        public string CustomerEmail { get; set; } = null!;
        public string? CustomerPhone { get; set; }

        
        public string ServiceName { get; set; } = null!;
        public string IssueDescription { get; set; } = null!;

        
        
        public DateOnly InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = null!;
    }

}
