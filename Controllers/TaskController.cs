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
    public class TaskController(ITaskService service) : ControllerBase
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
        public async Task<ActionResult<List<ProjectTasks>>> GetTasks()
                 => Ok(await service.GetAllTasksAsync());
        //  instead of the above method you can aslo this method below..
    //    public async Task<ActionResult<List<Users>>> GetUsers()
    //    {
    //       return Ok(users);
    //    

         [HttpGet("{id}")]
         public async Task<ActionResult<ProjectTasks>> GetTasks(int id)
            {
                var task = await service.GetTasksByIdAsync(id);
                return task is null ? NotFound("project with the given Id was not found") : Ok(task);
                // if(user is null)
                //     {
                //         return NotFound("User with the given id way not found");
                //     }
                // return Ok(user);
            }
            [HttpGet("project/{id}")]
        public async Task<ActionResult<List<ProjectTasks>>> GetTasksByProject(int id)
        {
            var tasks = await service.GetTasksByProjectId(id);

            if (!tasks.Any())
                return NotFound("No Task is Assigned to that Project");

            return Ok(tasks);
        }
        [HttpPost]
        public async Task<ActionResult<ProjectTasks>> CreateTask(ProjectTasks tasks)
    {
        var CreatedTask = await service.AddTasksAsync(tasks);
        return Ok(CreatedTask);
    }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id , ProjectTasks tasks)
    {
        var result = await service.UpdateTaskAsync(id,tasks);

        if(!result)
        return NotFound("Task Not found");

        return Ok("User Updated sucessfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var result = await service.DeleteTaskAsync(id);

        if(!result)
        return NotFound("Task Not Found");

        return Ok("Task Deleted Successfully");
    }

    }
