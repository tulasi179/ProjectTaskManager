using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Projecttaskmanager.Data;
using Projecttaskmanager.Models;
using Microsoft.EntityFrameworkCore;

namespace Projecttaskmanager.Services;

public class UsersServices(AppDbContext context) : IUsersService
{

    public Task<Users> AddUsersAsync(Users users)
    {
        throw new NotImplementedException();
    }

    public Task<bool>  DeleteUsersAysnc(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Users>> GetAllUsersAsync()
     => await context.User.ToListAsync();

    public async Task<Users?> GetUserByIdAsync(int id)
    {
       var result= await context.User.FindAsync(id);
       return result;

    }
    public Task<bool> UpdateUserAysnc(int id, Users users)
    {
        throw new NotImplementedException();
    }

}