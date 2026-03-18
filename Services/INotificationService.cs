using Projecttaskmanager.Models;
namespace Projecttaskmanager.Services;

public interface INotificationService
{
    Task CreateNotification(int userId, string message);
    Task<List<Notification>> GetUserNotifications(int userId);
    Task MarkAsReadAsync(int notificationId, int userId);
}