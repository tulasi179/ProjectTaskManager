using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Projecttaskmanager.Models;
using Projecttaskmanager.Services;

namespace Projecttaskmanager.Controllers;
[Authorize(Roles = "Admin")]
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

          [HttpPost]
    public async Task<ActionResult<TaskDependency>> AddDependency(TaskDependency dependency)
    {
        var result = await service.AddDependency(dependency);

        return CreatedAtAction(
            nameof(GetDependencies),
            new { taskId = result.TaskId },
            result
        );
    }

     [HttpDelete("{taskId}/ {dependenttaskId}")]
    public async Task<IActionResult> RemoveDependency(int taskId, int dependentTaskId)
    {
        var result = await service.RemoveDependency(taskId, dependentTaskId);

        if (!result)
            return NotFound("Dependency not found");

        return Ok("Dependency removed successfully");
    }
}