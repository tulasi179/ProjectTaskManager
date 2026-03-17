using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Projecttaskmanager.DTOs;
using Projecttaskmanager.Services;

namespace Projecttaskmanager.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpGet]
   public async Task<IActionResult> GetMyNotifications()
    {
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var notifications = await notificationService.GetUserNotifications(currentUserId);

        var response = notifications.Select(n => new NotificationResponseDto
        {
            Id = n.Id,
            UserId = n.UserId,
            Message = n.message,
            ReadStatus = n.ReadStatus,
            CreatedAt = n.CreatedAt
        });

        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserNotifications(int userId)
    {
        var notifications = await notificationService.GetUserNotifications(userId);
        return Ok(notifications);
    }
}