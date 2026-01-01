namespace ServiceManagementApis.Models;


public class Payment
{
    public int PaymentId { get; set; }            // PK

    public int InvoiceId { get; set; }             // FK → Invoice
    public Invoice Invoice { get; set; } = null!;

    public DateTime PaymentDate { get; set; }     // time matters here
    public decimal AmountPaid { get; set; }
    public string PaymentMethod { get; set; } = null!;
}
