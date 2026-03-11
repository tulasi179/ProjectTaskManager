using Projecttaskmanager.Services;
using Microsoft.AspNetCore.Mvc;
namespace Projecttaskmanager.Controllers;


[ApiController]
[Route("api/[controller]")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserNotifications(int userId)
    {
        var notifications = await notificationService.GetUserNotifications(userId);

        return Ok(notifications);
    }
}