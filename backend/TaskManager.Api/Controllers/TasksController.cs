using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

/// <summary>
/// 任务管理控制器
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly TaskContext _context;

    public TasksController(TaskContext context)
    {
        _context = context;
    }

    /// <summary>
    /// 获取所有任务
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        return await _context.Tasks.ToListAsync();
    }

    /// <summary>
    /// 根据ID获取任务
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTaskItem(int id)
    {
        var taskItem = await _context.Tasks.FindAsync(id);
        return taskItem == null ? NotFound() : taskItem;
    }

    /// <summary>
    /// 创建新任务
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem taskItem)
    {
        taskItem.CreatedAt = DateTime.UtcNow;
        
        if (taskItem.IsCompleted)
        {
            taskItem.CompletedAt = DateTime.UtcNow;
        }

        _context.Tasks.Add(taskItem);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, taskItem);
    }

    /// <summary>
    /// 更新任务
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem taskItem)
    {
        if (id != taskItem.Id) return BadRequest();

        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null) return NotFound();

        // 更新完成时间
        UpdateCompletionTime(existingTask, taskItem.IsCompleted);

        // 更新其他属性
        existingTask.Title = taskItem.Title;
        existingTask.Description = taskItem.Description;
        existingTask.IsCompleted = taskItem.IsCompleted;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// 更新任务的完成时间逻辑
    /// </summary>
    private void UpdateCompletionTime(TaskItem task, bool newCompletedStatus)
    {
        // 从未完成变为完成
        if (newCompletedStatus && !task.IsCompleted)
        {
            task.CompletedAt = DateTime.UtcNow;
        }
        // 从完成变为未完成
        else if (!newCompletedStatus && task.IsCompleted)
        {
            task.CompletedAt = null;
        }
        // 已经是完成但没有完成时间（修复历史数据）
        else if (newCompletedStatus && task.IsCompleted && task.CompletedAt == null)
        {
            task.CompletedAt = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// 删除任务
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var taskItem = await _context.Tasks.FindAsync(id);
        if (taskItem == null) return NotFound();

        _context.Tasks.Remove(taskItem);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    private bool TaskExists(int id)
    {
        return _context.Tasks.Any(e => e.Id == id);
    }
}