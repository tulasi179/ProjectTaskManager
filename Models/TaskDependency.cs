using System.ComponentModel.DataAnnotations;

namespace Projecttaskmanager.Models;

public class TaskDependency
{
     [Required]
    public int TaskId { get; set; }
    public int DependentTaskId { get; set; }

    // Navigation properties
    public ProjectTasks Task { get; set; } = null!;
    public ProjectTasks DependentTask { get; set; } = null!;
}