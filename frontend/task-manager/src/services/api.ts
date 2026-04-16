import axios from 'axios';
import { TaskItem } from '../types';

// API基础URL，使用代理转发到后端
const API_BASE_URL = '/api';

// 创建axios实例，配置基础URL和请求头
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 任务服务对象，封装了所有与任务相关的API调用
 */
export const taskService = {
    /**
     * 获取所有任务
     * @returns Promise<TaskItem[]>
     */
    getAllTasks: () => api.get<TaskItem[]>('/tasks'),
    
    /**
     * 根据ID获取单个任务
     * @param id 任务ID
     * @returns Promise<TaskItem>
     */
    getTaskById: (id: number) => api.get<TaskItem>(`/tasks/${id}`),
    
    /**
     * 创建新任务
     * @param task 不包含ID、createdAt和completedAt的任务数据
     * @returns Promise<TaskItem>
     */
    createTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'completedAt'>) =>
        api.post<TaskItem>('/tasks', task),
    
    /**
     * 更新任务
     * @param id 任务ID
     * @param task 部分任务数据
     * @returns Promise<any>
     */
    updateTask: (id: number, task: Partial<TaskItem>) =>
        api.put(`/tasks/${id}`, task),
    
    /**
     * 删除任务
     * @param id 任务ID
     * @returns Promise<any>
     */
    deleteTask: (id: number) => api.delete(`/tasks/${id}`),
    
    /**
     * 切换任务完成状态
     * @param id 任务ID
     * @param isCompleted 新的完成状态
     * @returns Promise<any>
     */
    toggleTaskCompletion: (id: number, isCompleted: boolean) =>
        api.put(`/tasks/${id}`, { ...{ id }, isCompleted }),
};

export default api;