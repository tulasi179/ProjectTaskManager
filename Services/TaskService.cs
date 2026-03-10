using Projecttaskmanager.Data;
using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Models;
namespace Projecttaskmanager.Services;


public class TaskService(AppDbContext context): ITaskService
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


}