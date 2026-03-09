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

[ApiController]
[Route("api/[controller]")]
public class TaskDependencyController(ITaskDependencyService service) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<List<TaskDependency>>> GetDependencies()
        => Ok(await service.GetDependencies());
  

   [HttpGet("{taskId}/dependents")]
        public async Task<ActionResult<List<TaskDependency>>> GetDependentTasksbyId(int taskId)
        {
            var tasks = await service.GetDependentTasksById(taskId);

            return Ok(tasks);
        }
}