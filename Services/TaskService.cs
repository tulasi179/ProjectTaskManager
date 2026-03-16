// using Projecttaskmanager.Data;
// using Microsoft.EntityFrameworkCore;
// using Projecttaskmanager.Models;
// namespace Projecttaskmanager.Services;


// public class TaskService(AppDbContext context, INotificationService notificationService): ITaskService
// {

//     public async Task<List<ProjectTasks>> GetAllTasksAsync()
//         => await context.tasks.ToListAsync();

//     public async Task<ProjectTasks?> GetTasksByIdAsync(int id)
//     {
//         var task = await context.tasks.FindAsync(id);
//         return task;
//     }

//       public   async Task<List<ProjectTasks>> GetTasksByProjectId(int id)
//     {
//          return await context.tasks.
//                 Where(t => t.ProjectId==id)
//                 .ToListAsync();
//     }

//     public async Task<ProjectTasks> AddTasksAsync(ProjectTasks tasks)
//     {
//         context.tasks.Add(tasks);
//         await context.SaveChangesAsync();
//         return tasks;
//     }

//     public  async Task<bool> DeleteTaskAsync(int id)
//     {
//          var res = await context.tasks.FindAsync(id);
//          if(res == null)
//          return false;

//          context.tasks.Remove(res);
//          await context.SaveChangesAsync();
//          return true;
//     }
//     public async Task<bool> UpdateTaskAsync(int id, ProjectTasks tasks)
//     {
//         var existing = await context.tasks.FindAsync(id);

//         if(existing == null)
//         return false;

//         existing.AssigneeId = tasks.AssigneeId;
//         existing.Description = tasks.Description;
//         existing.ProjectId = tasks.ProjectId;
//         existing.Status = tasks.Status;
//         existing.Title = tasks.Title;

//         await context.SaveChangesAsync();
//         return true;
//     }

    

// }

using Projecttaskmanager.Data;
using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Services;

public class TaskService(AppDbContext context, INotificationService notificationService) : ITaskService
{
    public async Task<List<ProjectTasks>> GetAllTasksAsync()
        => await context.tasks.ToListAsync();

    public async Task<ProjectTasks?> GetTasksByIdAsync(int id)
        => await context.tasks.FindAsync(id);

    public async Task<List<ProjectTasks>> GetTasksByProjectId(int id)
        => await context.tasks
            .Where(t => t.ProjectId == id)
            .ToListAsync();

    public async Task<ProjectTasks> AddTasksAsync(ProjectTasks tasks)
    {
        context.tasks.Add(tasks);
        await context.SaveChangesAsync();
        return tasks;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var res = await context.tasks.FindAsync(id);
        if (res == null) return false;

        context.tasks.Remove(res);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateTaskAsync(int id, ProjectTasks tasks)
    {
        var existing = await context.tasks.FindAsync(id);
        if (existing == null) return false;

        bool justCompleted = tasks.Status == "Completed" && existing.Status != "Completed";

        existing.AssigneeId = tasks.AssigneeId;
        existing.Description = tasks.Description;
        existing.ProjectId = tasks.ProjectId;
        existing.Status = tasks.Status;
        existing.Title = tasks.Title;

        await context.SaveChangesAsync();

        // If task just became Completed, notify assignees of dependent tasks
        if (justCompleted)
            await NotifyDependentTaskAssignees(existing);

        return true;
    }

    // When task A completes, find all tasks that were waiting on A (DependentTaskId == A)
    // and notify their assignees
   private async Task NotifyDependentTaskAssignees(ProjectTasks completedTask)
{
    var dependentTasks = await context.dependent
        .Where(d => d.DependentTaskId == completedTask.Id)
        .Join(context.tasks,
            d => d.TaskId,
            t => t.Id,
            (d, t) => t)
        .ToListAsync();

    foreach (var depTask in dependentTasks)
    {
        await notificationService.CreateNotification(
            depTask.AssigneeId,
            $"Task '{completedTask.Title}' has been completed. Your task '{depTask.Title}' can now proceed."
        );
    }
}
}