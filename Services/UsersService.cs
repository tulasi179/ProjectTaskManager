using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Projecttaskmanager.Data;
using Projecttaskmanager.Models;
using Microsoft.EntityFrameworkCore;
using Projecttaskmanager.DTOs;

namespace Projecttaskmanager.Services;

public class UsersServices(AppDbContext context) : IUsersService
{

    public async Task<List<UserResponce>> GetAllUsersAsync()
     => await context.User.Select(c => new UserResponce
     {
         Username = c.Username,
         Email = c.Email,
         Role = c.Role

     }).ToListAsync();

    public async Task<UserResponce?> GetUserByIdAsync(int id)
    {
       var result= await context.User
            .Where(c =>c.Id ==id)
            .Select(c => new UserResponce
            {
                Username = c.Username,
                Email = c.Email,
                Role = c.Role
            })
            .FirstOrDefaultAsync();

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