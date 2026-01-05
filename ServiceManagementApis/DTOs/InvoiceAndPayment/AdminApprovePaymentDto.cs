namespace ServiceManagementApis.DTOs.InvoiceAndPayment
{
    public class AdminApprovePaymentDto
    {
        public int InvoiceId { get; set; }
        public string PaymentMethod { get; set; } = null!;
    }

}
