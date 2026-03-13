using System.ComponentModel.DataAnnotations;

namespace Projecttaskmanager.Models;


public class Project
{
   public int Id { get; set; }
    public string Name { get; set; } = null!;

    [Required]
    public int OwnerId { get; set; }
    public DateTime StartDate { get; set; } = DateTime.Now;

    [Required]
    public DateTime EndDate { get; set; }

    // Navigation properties
    public Users Owner { get; set; } = null!;
    public ICollection<ProjectTasks> Tasks { get; set; } = new List<ProjectTasks>();


}