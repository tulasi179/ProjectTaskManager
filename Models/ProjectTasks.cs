using System.ComponentModel.DataAnnotations;

namespace Projecttaskmanager.Models;


public class ProjectTasks
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public int AssigneeId { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public Users Assignee { get; set; } = null!;
    public ICollection<TaskDependency> Dependencies { get; set; } = new List<TaskDependency>();
    public ICollection<TaskDependency> Dependents { get; set; } = new List<TaskDependency>();

    
}

