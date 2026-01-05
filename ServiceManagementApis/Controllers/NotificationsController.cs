using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceManagementApis.Data;
using ServiceManagementApis.DTOs;
using ServiceManagementApis.DTOs.Notifications;
using System.Security.Claims;

namespace ServiceManagementApis.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // GET: api/notifications
    // Get all notifications for logged-in user
    // =====================================================
    [HttpGet]
    public async Task<ActionResult<List<NotificationResponseDto>>> GetMyNotifications()
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );


        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponseDto
            {
                NotificationId = n.NotificationId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifications);
    }

    // =====================================================
    // GET: api/notifications/unread-count
    // Get unread notifications count
    // =====================================================
    [HttpGet("unread-count")]
    public async Task<ActionResult<UnreadCountDto>> GetUnreadCount()
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );


        int count = await _context.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);

        return Ok(new UnreadCountDto
        {
            Count = count
        });
    }

    // =====================================================
    // PUT: api/notifications/{id}/read
    // Mark a notification as read
    // =====================================================
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.NotificationId == id && n.UserId == userId);

        if (notification == null)
            return NotFound("Notification not found");

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }

        return NoContent();
    }

    // =====================================================
    // PUT: api/notifications/mark-all-read
    // Mark all notifications as read
    // =====================================================
    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        int userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var unreadNotifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        if (!unreadNotifications.Any())
            return NoContent();

        unreadNotifications.ForEach(n => n.IsRead = true);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
