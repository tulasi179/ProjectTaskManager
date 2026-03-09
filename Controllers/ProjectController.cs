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
namespace Projecttaskmanager.Controllers;


    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController(IProjectService service) : ControllerBase
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
        public async Task<ActionResult<List<Project>>> GetProject()
                 => Ok(await service.GetAllProjectsAsync());
        //  instead of the above method you can aslo this method below..
    //    public async Task<ActionResult<List<Users>>> GetUsers()
    //    {
    //       return Ok(users);
    //    

         [HttpGet("{id}")]
         public async Task<ActionResult<Users>> GetProject(int id)
            {
                var project = await service.GetProjectByIdAsync(id);
                return project is null ? NotFound("project with the given Id was not found") : Ok(project);
                // if(user is null)
                //     {
                //         return NotFound("User with the given id way not found");
                //     }
                // return Ok(user);
            }

    }
