using System.ComponentModel.DataAnnotations;

namespace Projecttaskmanager.Models;
public class Notification
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    public string message { get; set; } = string.Empty;

    public bool ReadStatus { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}