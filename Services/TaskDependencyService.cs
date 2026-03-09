using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Data;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Services;

public class TaskDependencyService(AppDbContext context) : ITaskDependencyService
{
    public async Task<List<TaskDependency>> GetDependencies()
        => await context.dependent.ToListAsync();

    public async Task<List<TaskDependency>> GetDependentTasksById(int taskId)
        => await context.dependent
            .Where(d => d.TaskId == taskId)
            .ToListAsync();

    public async Task<TaskDependency> AddDependency(TaskDependency dependency)
    {
        // context.dependent.Add(dependency);
        // await context.SaveChangesAsync();
        // return dependency;
        throw new NotImplementedException();
    }

    public async Task<bool> RemoveDependency(int taskId, int dependentTaskId)
    {
        // var dependency = await context.dependent
        //     .FirstOrDefaultAsync(d =>
        //         d.TaskId == taskId &&
        //         d.DependentTaskId == dependentTaskId);

        // if (dependency == null)
        //     return false;

        // context.dependent.Remove(dependency);
        // await context.SaveChangesAsync();

        // return true;
        throw new NotImplementedException();
    }
}