namespace Projecttaskmanager.DTOs;

public class UserResponce
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    //public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "User"; 
}