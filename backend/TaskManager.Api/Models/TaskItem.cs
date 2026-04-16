namespace TaskManager.Api.Models
{
    /// <summary>
    /// 任务项模型，表示一个具体的任务
    /// </summary>
    public class TaskItem
    {
        /// <summary>
        /// 任务唯一标识符
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// 任务标题，必填字段，最大长度200字符
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// 任务描述，可选字段，最大长度1000字符
        /// </summary>
        public string? Description { get; set; }
        
        /// <summary>
        /// 任务是否已完成的状态标志
        /// </summary>
        public bool IsCompleted { get; set; }
        
        /// <summary>
        /// 任务创建时间，默认为当前UTC时间
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// 任务完成时间，可为空，当IsCompleted为true时有值
        /// </summary>
        public DateTime? CompletedAt { get; set; }
    }
}