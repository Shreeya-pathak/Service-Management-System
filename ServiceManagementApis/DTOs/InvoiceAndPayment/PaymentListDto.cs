namespace ServiceManagementApis.DTOs.InvoiceAndPayment
{
    public class PaymentListDto
    {
        public int PaymentId { get; set; }
        public int InvoiceId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; } = null!;
    }

}
