using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data
{
    /// <summary>
    /// 任务数据库上下文，负责与任务相关数据表的交互
    /// </summary>
    public class TaskContext : DbContext
    {
        /// <summary>
        /// 构造函数，初始化数据库上下文
        /// </summary>
        /// <param name="options">数据库上下文选项</param>
        public TaskContext(DbContextOptions<TaskContext> options) : base(options)
        {
        }

        /// <summary>
        /// 任务数据集，对应数据库中的Tasks表
        /// </summary>
        public DbSet<TaskItem> Tasks { get; set; }

        /// <summary>
        /// 配置实体模型
        /// </summary>
        /// <param name="modelBuilder">模型构建器</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>(entity =>
            {
                // 设置主键
                entity.HasKey(e => e.Id);
                
                // 配置Title属性为必需且最大长度为200字符
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                
                // 配置Description属性最大长度为1000字符
                entity.Property(e => e.Description).HasMaxLength(1000);
                
                // 配置CreatedAt属性默认值为当前日期时间
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });
        }
    }
}