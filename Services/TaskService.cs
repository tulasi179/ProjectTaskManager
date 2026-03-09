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

      public   Task<ProjectTasks?> GetTasksByProjectId(int id)
    {
         throw new NotImplementedException();
    }

    public Task<ProjectTasks> AddTasksAsync(ProjectTasks tasks)
    {
         throw new NotImplementedException();
    }

    public  Task<bool> DeleteTaskAsync(int id)
    {
         throw new NotImplementedException();
    }
    public Task<bool> UpdateTaskAsync(int id, ProjectTasks tasks)
    {
        throw new NotImplementedException();
    }


}