import React from 'react';
import { TaskItem } from '../types';

/**
 * TaskList组件的属性接口定义
 */
interface TaskListProps {
    /** 任务列表数组 */
    tasks: TaskItem[];
    /** 编辑任务回调函数 */
    onEdit: (task: TaskItem) => void;
    /** 删除任务回调函数 */
    onDelete: (id: number) => void;
    /** 切换任务完成状态回调函数 */
    onToggle: (id: number, isCompleted: boolean) => void;
}

/**
 * 任务列表组件 - 显示所有任务项并提供编辑、删除和切换完成状态的功能
 */
const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggle }) => {
    // 当任务列表为空时显示提示信息
    if (tasks.length === 0) {
        return <p>No tasks available.</p>;
    }

    return (
        <ul className="task-list">
            {/* 遍历任务数组，渲染每个任务项 */}
            {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                    <div className="task-info">
                        <h3>{task.title}</h3>
                        {/* 如果存在描述则显示 */}
                        {task.description && <p>{task.description}</p>}
                        {/* 显示创建时间和完成时间 */}
                        <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
                        {task.completedAt && (
                            <small>Completed: {new Date(task.completedAt).toLocaleString()}</small>
                        )}
                    </div>
                    <div className="task-actions">
                        {/* 复选框用于切换任务完成状态 */}
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={(e) => onToggle(task.id, e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                        {/* 编辑按钮，触发编辑回调 */}
                        <button onClick={() => onEdit(task)}>Edit</button>
                        {/* 删除按钮，触发删除回调 */}
                        <button onClick={() => onDelete(task.id)} className="delete-btn">
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;