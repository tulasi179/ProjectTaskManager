namespace Projecttaskmanager.DTOs;

public class RefeshTokenRequestDto
{
    public int UserId {get; set;}
    public required string RefreshToken {get ; set;}

}