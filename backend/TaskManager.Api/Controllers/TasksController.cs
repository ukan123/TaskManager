using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers
{
    /// <summary>
    /// 任务管理控制器，提供任务的增删改查功能
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskContext _context;

        /// <summary>
        /// 构造函数，注入数据库上下文
        /// </summary>
        /// <param name="context">任务数据库上下文</param>
        public TasksController(TaskContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 获取所有任务项
        /// </summary>
        /// <returns>所有任务项的集合</returns>
        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            return await _context.Tasks.ToListAsync();
        }

        /// <summary>
        /// 根据ID获取特定任务项
        /// </summary>
        /// <param name="id">任务ID</param>
        /// <returns>指定ID的任务项</returns>
        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTaskItem(int id)
        {
            var taskItem = await _context.Tasks.FindAsync(id);

            if (taskItem == null)
            {
                return NotFound();
            }

            return taskItem;
        }

        /// <summary>
        /// 创建新任务项
        /// </summary>
        /// <param name="taskItem">要创建的任务项</param>
        /// <returns>创建成功的任务项</returns>
        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskItem>> PostTaskItem(TaskItem taskItem)
        {
            // 设置任务创建时间
            taskItem.CreatedAt = DateTime.UtcNow;
            _context.Tasks.Add(taskItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, taskItem);
        }

        /// <summary>
        /// 更新指定ID的任务项
        /// </summary>
        /// <param name="id">任务ID</param>
        /// <param name="taskItem">更新后的任务数据</param>
        /// <returns>HTTP响应结果</returns>
        // PUT: api/Tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskItem(int id, TaskItem taskItem)
        {
            if (id != taskItem.Id)
            {
                return BadRequest();
            }

            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            // 更新任务属性
            existingTask.Title = taskItem.Title;
            existingTask.Description = taskItem.Description;
            existingTask.IsCompleted = taskItem.IsCompleted;
            
            // 如果任务从未完成变为完成，则记录完成时间
            if (taskItem.IsCompleted && !existingTask.IsCompleted)
            {
                existingTask.CompletedAt = DateTime.UtcNow;
            }
            // 如果任务被标记为未完成，则清除完成时间
            else if (!taskItem.IsCompleted)
            {
                existingTask.CompletedAt = null;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            // 捕获并发更新异常
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// 删除指定ID的任务项
        /// </summary>
        /// <param name="id">任务ID</param>
        /// <returns>HTTP响应结果</returns>
        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            var taskItem = await _context.Tasks.FindAsync(id);
            if (taskItem == null)
            {
                return NotFound();
            }

            // 从数据库中移除任务
            _context.Tasks.Remove(taskItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// 检查任务是否存在
        /// </summary>
        /// <param name="id">任务ID</param>
        /// <returns>如果任务存在返回true，否则返回false</returns>
        private bool TaskItemExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }
    }
}