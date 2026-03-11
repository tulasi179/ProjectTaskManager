using Projecttaskmanager.Data;
using Projecttaskmanager.Models;
using Microsoft.EntityFrameworkCore;
namespace Projecttaskmanager.Services;

public class NotificationService(AppDbContext context) : INotificationService
{
    public async Task CreateNotification(int userId, string Message)
    {
        var notification = new Notification
        {
            UserId = userId,
            message = Message
        };

        context.notify.Add(notification);
        await context.SaveChangesAsync();
    }

    public async Task<List<Notification>> GetUserNotifications(int userId)
    {
        return await context.notify
            .Where(n => n.UserId == userId)
            .ToListAsync();
    }
}