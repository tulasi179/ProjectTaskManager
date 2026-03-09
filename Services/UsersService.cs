using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Services;

public class UsersServices : IUsersService
{

    static List<Users> users= new List<Users> {
             new Users {Id =1, Username ="Tulasi", Email = "tulasinalluri23@gmail.com", PasswordHash = "password1234", Role = "User", IsActive = true},
              new Users{Id = 2, Username = "Tejaswi", Email = "tejanalluri293@hamil.com", PasswordHash = "teaswi@2004", Role = "Admin", IsActive = true},
              new Users{Id = 3, Username = "Sai", Email = "sai@gmail.com", PasswordHash = "Pass123", Role = "Admin", IsActive = true},
              new Users{Id = 4 , Username = "Nikhita", Email="Nikhita@gmail.com",PasswordHash ="ssap321", Role="User" , IsActive=true }
        
        };

    public Task<Users> AddUsersAsync(Users users)
    {
        throw new NotImplementedException();
    }

    public Task<bool>  DeleteUsersAysnc(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Users>> GetAllUsersAsync()
     => await Task.FromResult((users));

    public async Task<Users?> GetUserByIdAsync(int id)
    {
       var result= users.FirstOrDefault(c => c.Id == id);
       return await Task.FromResult(result);

    }
    public Task<bool> UpdateUserAysnc(int id, Users users)
    {
        throw new NotImplementedException();
    }

}