using System.Reflection.PortableExecutable;
using Projecttaskmanager.Models;
using Projecttaskmanager.DTOs;

namespace Projecttaskmanager.Services;

public interface   IUsersService
{
    Task<List<UserResponce>> GetAllUsersAsync();
    Task<UserResponce?> GetUserByIdAsync(int id);
    Task<Users> AddUsersAsync(Users users);
    Task<bool> UpdateUserAysnc(int id, Users users);
    Task<bool> DeleteUsersAysnc(int id);

}