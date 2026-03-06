using System.Reflection.PortableExecutable;
using Projecttaskmanager.Models;

namespace Projecttaskmanager.Services;

public interface  IUsersService
{
    Task<List<Users>> GetAllUsersAsync();
    Task<Users> GetUserByIdAsync(int id);
    Task<Users> AddUsersAsync(Users users);
    Task<bool> UpdateUserAysnc(int id, Users users);
    Task<bool> DeleteUsersAysnc(int id);

}