using System.ComponentModel.DataAnnotations;

namespace Projecttaskmanager.Models;

public class TaskDependency
{
    //TaskDependencies (TaskId, DependentTaskId) 
    [Required]
    public int TaskId{get; set;}

    public int DependentTaskId{get; set;}
}