using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Projecttaskmanager.Data;
using Projecttaskmanager.Models;
using Microsoft.EntityFrameworkCore;

namespace Projecttaskmanager.Services;

public class UsersServices(AppDbContext context) : IUsersService
{

    public async Task<List<Users>> GetAllUsersAsync()
     => await context.User.ToListAsync();

    public async Task<Users?> GetUserByIdAsync(int id)
    {
       var result= await context.User.FindAsync(id);
       return result;

    }
    public async Task<Users> AddUsersAsync(Users users)
    {
         context.User.Add(users);

        await context.SaveChangesAsync();

        return users;
    }

    public async Task<bool>  DeleteUsersAysnc(int id)
    {
        var user = await context.User.FindAsync(id);

        if (user == null)
            return false;

        context.User.Remove(user);

        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateUserAysnc(int id, Users users)
    {
        var existingUser = await context.User.FindAsync(id);

        if (existingUser == null)
            return false;

        existingUser.Username = users.Username;
        existingUser.Email= users.Email;
        existingUser.PasswordHash = users.PasswordHash;
        existingUser.Role = users.Role;
        existingUser.IsActive = users.IsActive;
        existingUser.CreatedAt = DateTime.Now;

        await context.SaveChangesAsync();

        return true;
    }

}