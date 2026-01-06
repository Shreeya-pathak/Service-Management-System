using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs.InvoiceAndPayment;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories.Interfaces;
using ServiceManagementApis.Services;

namespace ServiceManagementApis.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly INotificationRepository _notificationRepo;
        private readonly IUserRepository _userRepository;
        private readonly IInvoiceService _service;

        public InvoiceController(
            IInvoiceService invoiceService,
            INotificationRepository notificationRepo,
            IUserRepository userRepository,
            IInvoiceService service)
        {
            _invoiceService = invoiceService;
            _notificationRepo = notificationRepo;
            _userRepository = userRepository;
            _service = service;
        }

        
        [HttpGet("by-service-request/{serviceRequestId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Get(int serviceRequestId)
        {
            var invoice = await _invoiceService.GetInvoiceAsync(serviceRequestId);
            return Ok(invoice);
        }

        
        [HttpPut("make-payment/{invoiceId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> MakePayment(
            int invoiceId,
            [FromBody] CustomerMakePaymentDto dto)
        {
            // 1️⃣ Perform payment
            await _invoiceService.CustomerMakePaymentAsync(
                invoiceId,
                dto.PaymentMethod
            );

            // 2️⃣ Notify Admin(s) — INFO ONLY
            

            // 3️⃣ Notify Customer
            var customerId =
                await _invoiceService.GetCustomerIdByInvoiceIdAsync(invoiceId);

            var serviceName =
                await _invoiceService.GetServiceNameByInvoiceIdAsync(invoiceId);

            if (customerId != null)
            {
                await _notificationRepo.AddAsync(new Notification
                {
                    UserId = customerId.Value,
                    Title = "Payment Successful",
                    Message = serviceName != null
                        ? $"Payment for '{serviceName}' was successful. Your service request is now closed."
                        : "Your payment was successful. Your service request is now closed."
                });
            }

            await _notificationRepo.SaveAsync();

            return Ok(new { message = "Payment successful" });
        }
    }
}
