using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Data;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Services;

public class ProjectService(AppDbContext context) :IProjectService
{
    /*
    Task<List<Project>> GetAllProjectsAsync();
        Task<Project?> GetProjectByIdAsync(int Id);
        Task<Project> AddProjectAsync(Project project);
        Task<bool> UpdateProjectAsync(int id, Project project);
        Task<bool> DeleteProjetcAsync(int id);
    */

    public async Task<List<Project>> GetAllProjectsAsync()
        => await context.project.ToListAsync();

    public async Task<Project?> GetProjectByIdAsync(int id)
    {
        var result = await context.project.FindAsync(id);
        return result;
    }

    public  Task<Project> AddProjectAsync(Project project)
    {
         throw new NotImplementedException();
    }

    public Task<bool> UpdateProjectAsync(int id, Project project)
    {
         throw new NotImplementedException();
    }

    public  Task<bool> DeleteProjectAsync(int id)
    {
         throw new NotImplementedException();
    }

}