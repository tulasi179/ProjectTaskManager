using Projecttaskmanager.Data;
using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Models;
namespace Projecttaskmanager.Services;


public class TaskService(AppDbContext context, INotificationService notificationService): ITaskService
{
    //  Task<List<ProjectTasks>> GetAllTasksAsync();

    // Task<ProjectTasks?> GetTasksByProjectId(int id);

    // Task<ProjectTasks?> GetTasksByIdAsync(int id);

    // Task<ProjectTasks> AddTasksAsync(int id , ProjectTasks tasks);
    // Task<bool> DeleteTaskAsync(int id);

    // Task<bool> UpdateTaskAsync(int id , ProjectTasks tasks);

    public async Task<List<ProjectTasks>> GetAllTasksAsync()
        => await context.tasks.ToListAsync();

    public async Task<ProjectTasks?> GetTasksByIdAsync(int id)
    {
        var task = await context.tasks.FindAsync(id);
        return task;
    }

      public   async Task<List<ProjectTasks>> GetTasksByProjectId(int id)
    {
         return await context.tasks.
                Where(t => t.ProjectId==id)
                .ToListAsync();
    }

    public async Task<ProjectTasks> AddTasksAsync(ProjectTasks tasks)
    {
        context.tasks.Add(tasks);
        await context.SaveChangesAsync();
        return tasks;
    }

    public  async Task<bool> DeleteTaskAsync(int id)
    {
         var res = await context.tasks.FindAsync(id);
         if(res == null)
         return false;

         context.tasks.Remove(res);
         await context.SaveChangesAsync();
         return true;
    }
    public async Task<bool> UpdateTaskAsync(int id, ProjectTasks tasks)
    {
        var existing = await context.tasks.FindAsync(id);

        if(existing == null)
        return false;

        existing.AssigneeId = tasks.AssigneeId;
        existing.Description = tasks.Description;
        existing.ProjectId = tasks.ProjectId;
        existing.Status = tasks.Status;
        existing.Title = tasks.Title;

        await context.SaveChangesAsync();
        return true;
    }

    public async Task CompleteTask(int taskId)
{
    var task = await context.tasks.FindAsync(taskId);
    if(task == null)
    throw new Exception("Task not found");

    task.Status = "Completed";

    await context.SaveChangesAsync();

    var dependentTasks = await context.dependent
        .Where(td => td.DependentTaskId == taskId)
        .ToListAsync();

    foreach (var dependency in dependentTasks)
    {
        var nextTask = await context.tasks
            .FindAsync(dependency.TaskId);

        if (nextTask != null)
        {
            await notificationService.CreateNotification(
                nextTask.AssigneeId,
                $"Task '{nextTask.Title}' is now unblocked and ready to start."
            );
        }
    }
}

    /*    public async Task CompleteTask(int taskId)
{
    var task = await context.ProjectTasks.FindAsync(taskId);

    if (task == null)
        throw new Exception("Task not found");

    task.Status = "Completed";

    await context.SaveChangesAsync();

    // find tasks that depend on this task
    var dependentTasks = await context.TaskDependencies
        .Where(td => td.DependentTaskId == taskId)
        .ToListAsync();

    foreach (var dependency in dependentTasks)
    {
        var nextTask = await context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == dependency.TaskId);

        if (nextTask == null)
            continue;

        // check if all dependencies of this task are completed
        var allDependencies = await context.TaskDependencies
            .Where(td => td.TaskId == nextTask.Id)
            .ToListAsync();

        bool allCompleted = true;

        foreach (var dep in allDependencies)
        {
            var depTask = await context.ProjectTasks
                .FirstOrDefaultAsync(t => t.Id == dep.DependentTaskId);

            if (depTask.Status != "Completed")
            {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted)
        {
            await notificationService.CreateNotification(
                nextTask.AssigneeId,
                $"Task '{nextTask.Title}' is now unblocked."
            );
        }
    }
}*/


}