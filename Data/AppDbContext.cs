using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Users> User => Set<Users>();
    //can be used to query and save instances of Users.
    //LinQ queries against a DbSet<> will be translated into queries against the database
    //the results of a LINQ query against a DbSet <> will contain the results returned from
    //  the database and may not reflect changes made in the context that have not been persisted to the database

    public DbSet<Project> project => Set<Project>();

    public DbSet<ProjectTasks> tasks => Set<ProjectTasks>();

    public DbSet<TaskDependency> dependent => Set<TaskDependency>();

//to create component key...
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskDependency>()
            .HasKey(td => new { td.TaskId, td.DependentTaskId });
    }

    //public DbSet<Notification> Notifi => Set<Notification>();
}