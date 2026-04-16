import React, { useState } from 'react';
import { TaskItem } from '../types';

/**
 * TaskForm组件的属性接口定义
 */
interface TaskFormProps {
    /** 提交任务的回调函数 */
    onSubmit: (task: Omit<TaskItem, 'id' | 'createdAt' | 'completedAt'>) => void;
    /** 取消操作的回调函数 */
    onCancel: () => void;
    /** 初始数据，用于编辑任务时的默认值 */
    initialData?: Partial<TaskItem>;
}

/**
 * 任务表单组件 - 提供创建和编辑任务的表单界面
 */
const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
    // 使用状态管理表单输入值
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');

    /**
     * 表单提交事件处理器
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 调用父组件传入的提交回调函数
        onSubmit({ 
            title, 
            description: description || undefined, 
            isCompleted: false 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter task title"
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description (optional)"
                />
            </div>
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default TaskForm;