using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Projecttaskmanager.Models;
using Projecttaskmanager.Services;
using Projecttaskmanager.DTOs;

namespace Projecttaskmanager.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IUsersService service) : ControllerBase
    {
        //we need to inject the service , there are two ways to do that

        //1st : using the constructor (older way)
        /*
        private static readonly List<Users> characters = new()
        {
        new Users{id = 1, Username="fghjk", passwordhash="dfghjkl",Isactive=true}
        }
        */

        //2nd way is implemented in the code.

        
       [HttpGet]
        public async Task<ActionResult<List<UserResponce>>> GetUsers()
                 => Ok(await service.GetAllUsersAsync());
        //  instead of the above method you can aslo this method below..
    //    public async Task<ActionResult<List<Users>>> GetUsers()
    //    {
    //       return Ok(users);
    //    

         [HttpGet("{id}")]
         public async Task<ActionResult<UserResponce>> GetUser(int id)
            {
                var user = await service.GetUserByIdAsync(id);
                return user is null ? NotFound("user with the given Id was not found") : Ok(user);
                // if(user is null)
                //     {
                //         return NotFound("User with the given id way not found");
                //     }
                // return Ok(user);
            }
         [HttpPost]
        public async Task<ActionResult<Users>> CreateUser(Users user)
        {
            var createdUser = await service.AddUsersAsync(user);

            return Ok(createdUser);
        }

         [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, Users user)
    {
        var result = await service.UpdateUserAysnc(id, user);

        if (!result)
            return NotFound("User not found");

        return Ok("User updated successfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await service.DeleteUsersAysnc(id);

        if (!result)
            return NotFound("User not found");

        return Ok("User deleted successfully");
    }
           
    }
