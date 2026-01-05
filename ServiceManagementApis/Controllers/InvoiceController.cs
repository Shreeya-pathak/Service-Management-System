using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagementApis.DTOs.InvoiceAndPayment;
using ServiceManagementApis.Models;
using ServiceManagementApis.Repositories;
using ServiceManagementApis.Repositories.Interfaces;
using ServiceManagementApis.Services;


namespace ServiceManagementApis.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _service;
        private readonly IInvoiceService _invoiceService;
        private readonly INotificationRepository _notificationRepo;
        private readonly IUserRepository _userRepository;
        public InvoiceController(IInvoiceService service, IInvoiceService invoiceService, INotificationRepository notificationRepo, IUserRepository userRepository)
        {
            _service = service;
            _invoiceService = invoiceService;
            _notificationRepo = notificationRepo;
            _userRepository = userRepository;
        }

        // CUSTOMER + ADMIN VIEW
        [HttpGet("by-service-request/{serviceRequestId}")]
        [Authorize(Roles = "Customer,Admin")]
        public async Task<IActionResult> Get(int serviceRequestId)
            => Ok(await _service.GetInvoiceAsync(serviceRequestId));

        // CUSTOMER ACTION
        [HttpPut("make-payment/{invoiceId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> MakePayment(int invoiceId)
        {
            await _service.CustomerMakePaymentAsync(invoiceId);
            // 🔔 Notify Admin(s): New payment request
            var adminIds = await _userRepository.GetUserIdsByRoleAsync("Admin");

            foreach (var adminId in adminIds)
            {
                await _notificationRepo.AddAsync(new Notification
                {
                    UserId = adminId,
                    Title = "New Payment Request",
                    Message = "A customer has made a payment request that requires approval."
                });
            }

            await _notificationRepo.SaveAsync();
            return Ok(new { message = "Waiting for admin approval" });
        }

        // ADMIN ACTION
        [HttpPut("approve-payment/{invoiceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApprovePayment(
            int invoiceId,
            [FromBody] AdminApprovePaymentDto dto)
        {
            var customerId = await _invoiceService
                .GetCustomerIdByInvoiceIdAsync(invoiceId);

            var serviceName = await _invoiceService
                .GetServiceNameByInvoiceIdAsync(invoiceId);
            await _invoiceService.AdminApprovePaymentAsync(invoiceId, dto.PaymentMethod);
            if (customerId != null)
            {
                await _notificationRepo.AddAsync(new Notification
                {
                    UserId = customerId.Value,
                    Title = "Service Request Closed",
                    Message = serviceName != null
                        ? $"Your service request for '{serviceName}' has been closed after successful payment."
                        : "Your service request has been closed after successful payment."
                });

                await _notificationRepo.SaveAsync();
            }
            return Ok(new { message = "Payment approved" });

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("pending-approvals")]
        public async Task<IActionResult> PendingApprovals()
        {
            var data = await _invoiceService.GetPendingPaymentApprovalsAsync();
            return Ok(data);
        }

    }


}
