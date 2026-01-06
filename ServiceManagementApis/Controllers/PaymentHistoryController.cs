using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.Repositories.PaymentRepositories;
using ServiceManagementApis.Services;

[Authorize(Roles = "Admin,ServiceManager")]
[ApiController]
[Route("api/payments")]
public class PaymentHistoryController : ControllerBase
{
    private readonly IPaymentRepository _paymentRepo;

    public PaymentHistoryController(IPaymentRepository paymentRepo)
    {
        _paymentRepo = paymentRepo;
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetPaymentHistory()
    {
        var payments = await _paymentRepo.GetAllAsync();

        var result = payments.Select(p => new PaymentHistoryDto
        {
            PaymentId = p.PaymentId,
            InvoiceId = p.InvoiceId,
            CustomerName = p.Invoice.ServiceRequest.Customer.FullName,
            PaymentDate = p.PaymentDate,
            AmountPaid = p.AmountPaid,
            PaymentMethod = p.PaymentMethod
        }).ToList();

        return Ok(result);
    }
}
