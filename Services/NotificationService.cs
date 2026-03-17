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
        var user = await context.User.FindAsync(userId);
        if (user is null)
            throw new KeyNotFoundException($"User with Id {userId} was not found.");
        return await context.notify
            .Where(n => n.UserId == userId)
            .ToListAsync();
    }
}