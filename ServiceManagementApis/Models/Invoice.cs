namespace ServiceManagementApis.Models;

public class Invoice
{
    public int InvoiceId { get; set; }            // PK

    public int ServiceRequestId { get; set; }     // FK → ServiceRequest
    public ServiceRequest ServiceRequest { get; set; } = null!;

    public DateOnly InvoiceDate { get; set; }

    
    public decimal TotalAmount { get; set; }
    public string PaymentStatus { get; set; } = "null"!;
}
