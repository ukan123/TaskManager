// 从 React 库中导入需要的钩子函数（Hooks）
// useState: 用于管理组件的状态数据
// useEffect: 用于在组件渲染后执行副作用操作（如数据获取）
import { useState, useEffect } from 'react';

// 导入样式文件
import './App.css';

// 导入任务数据的类型定义（TypeScript 接口）
import { TaskItem } from './types';

// 导入封装好的 API 调用服务（包含 getAllTasks, createTask 等方法）
import { taskService } from './services/api';

// 导入任务表单组件（用于添加/编辑任务）
import TaskForm from './components/TaskForm';

// 导入任务列表组件（用于显示所有任务）
import TaskList from './components/TaskList';

// App 组件 - 整个应用的主组件
function App() {
    // ========== 状态变量定义（State）==========
    // tasks: 存储所有任务的数组，初始值为空数组
    // setTasks: 更新 tasks 的函数
    const [tasks, setTasks] = useState<TaskItem[]>([]);

    // loading: 是否正在加载数据（显示"加载中"）
    // setLoading: 更新 loading 状态的函数
    const [loading, setLoading] = useState(true);

    // error: 错误信息，没有错误时为 null
    // setError: 更新 error 状态的函数
    const [error, setError] = useState<string | null>(null);

    // showForm: 是否显示添加/编辑表单（true=显示，false=隐藏）
    // setShowForm: 更新 showForm 的函数
    const [showForm, setShowForm] = useState(false);

    // editingTask: 正在编辑的任务数据，null 表示当前是"新增模式"
    // setEditingTask: 更新 editingTask 的函数
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

    // ========== 副作用钩子（Effect）==========
    // useEffect: 组件首次渲染后自动执行
    // 空数组 [] 表示只执行一次（类似页面加载）
    useEffect(() => {
        fetchTasks();  // 调用获取任务列表的函数
    }, []);  // ← 依赖数组为空，只在组件挂载时执行一次

    // ========== 函数定义（Functions）==========
    
    /**
     * 从后端获取所有任务列表
     * async: 异步函数，因为要等待网络请求
     */
    const fetchTasks = async () => {
        try {
            // try 块：尝试执行可能出错的代码
            
            setLoading(true);  // 开始加载，显示"Loading tasks..."
            
            // 调用 API 服务获取所有任务
            // await: 等待网络请求完成（可能耗时）
            // response.data 是后端返回的任务数组
            const response = await taskService.getAllTasks();
            
            // 将获取到的任务数据保存到 state 中
            // React 会自动重新渲染页面
            setTasks(response.data);
            
        } catch (err) {
            // catch 块：如果 try 块中的代码出错，会执行这里
            
            // 设置错误信息，页面会显示红色错误提示
            setError('Failed to load tasks');
            
            // 在控制台打印详细错误（方便调试）
            console.error('Error fetching tasks:', err);
            
        } finally {
            // finally 块：无论成功还是失败，都会执行
            
            // 加载完成，关闭"Loading..."提示
            setLoading(false);
        }
    };

    /**
     * 处理"添加新任务"按钮点击
     * 显示空白表单，准备添加新任务
     */
    const handleAddTask = () => {
        setEditingTask(null);   // 清空编辑状态（表示这是新增，不是编辑）
        setShowForm(true);      // 显示表单组件
    };

    /**
     * 处理"编辑"按钮点击
     * @param task - 要编辑的任务对象
     * 显示表单并填充已有数据
     */
    const handleEditTask = (task: TaskItem) => {
        setEditingTask(task);   // 保存要编辑的任务数据（表单会用它填充）
        setShowForm(true);      // 显示表单组件
    };

    /**
     * 处理表单的"取消"按钮点击
     * 关闭表单，不清空任何数据（下次打开还是新的）
     */
    const handleCancelForm = () => {
        setShowForm(false);     // 隐藏表单
        setEditingTask(null);   // 清空编辑状态
    };

    /**
     * 处理表单提交（添加新任务 或 编辑现有任务）
     * @param taskData - 表单提交的任务数据（只有 title, description 等，没有 id）
     * Omit<TaskItem, 'id' | 'createdAt' | 'completedAt'> 表示排除这三个字段
     */
    const handleSubmitTask = async (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'completedAt'>) => {
        try {
            if (editingTask) {
                // ========== 情况1：编辑模式 ==========
                // editingTask 不为 null，说明是在编辑已有任务
                
                // 合并原任务数据和修改后的数据
                // { ...editingTask, ...taskData } 意思是：
                // 先展开原任务的所有属性，再用 taskData 覆盖
                const updatedTask = { ...editingTask, ...taskData };
                
                // 调用更新 API，传入任务 ID 和更新后的数据
                await taskService.updateTask(editingTask.id, updatedTask);
                
            } else {
                // ========== 情况2：新增模式 ==========
                // editingTask 为 null，说明是添加新任务
                
                // 调用创建 API，传入任务数据
                await taskService.createTask(taskData);
            }
            
            // 无论新增还是编辑，成功后都要：
            fetchTasks();           // 1. 重新获取任务列表（显示最新数据）
            setShowForm(false);     // 2. 关闭表单
            setEditingTask(null);   // 3. 清空编辑状态
            
        } catch (err) {
            // 请求失败时显示错误信息
            setError('Failed to save task');
            console.error('Error saving task:', err);
        }
    };

    /**
     * 处理"删除"按钮点击
     * @param id - 要删除的任务 ID
     */
    const handleDeleteTask = async (id: number) => {
        // window.confirm 弹出浏览器确认框
        // 用户点击"确定"返回 true，点击"取消"返回 false
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                // 调用删除 API，传入任务 ID
                await taskService.deleteTask(id);
                
                // 删除成功后重新获取任务列表（页面会更新）
                fetchTasks();
                
            } catch (err) {
                // 删除失败时显示错误
                setError('Failed to delete task');
                console.error('Error deleting task:', err);
            }
        }
    };

    /**
     * 处理复选框点击（切换任务的完成状态）
     * @param id - 任务 ID
     * @param isCompleted - 新的完成状态（true=已完成，false=未完成）
     */
    const handleToggleTask = async (id: number, isCompleted: boolean) => {
        try {
            // 调用切换状态 API
            await taskService.toggleTaskCompletion(id, isCompleted);
            
            // 成功后重新获取列表（显示最新状态）
            fetchTasks();
            
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    // ========== 条件渲染（Conditional Rendering）==========
    
    // 如果正在加载，显示"Loading tasks..."
    if (loading) {
        return <div>Loading tasks...</div>;
    }

    // 如果有错误，显示错误信息和一个"重试"按钮
    if (error) {
        return (
            <div>
                Error: {error}. 
                <button onClick={fetchTasks}>Retry</button>
            </div>
        );
    }

    // ========== 主界面渲染（Main Render）==========
    return (
        <div className="App">
            {/* 页面标题 */}
            <h1>Task Manager</h1>

            {/* 卡片区域：包含添加按钮 或 表单 */}
            <div className="card">
                
                {/* 条件渲染：只在 showForm 为 false 时显示"Add New Task"按钮 */}
                {/* !showForm 的意思是"当 showForm 为 false 时" */}
                {!showForm && (
                    <button onClick={handleAddTask}>
                        Add New Task
                    </button>
                )}

                {/* 条件渲染：只在 showForm 为 true 时显示任务表单 */}
                {showForm && (
                    <TaskForm
                        onSubmit={handleSubmitTask}           // 提交表单时调用
                        onCancel={handleCancelForm}           // 取消时调用
                        initialData={editingTask || undefined} // 编辑时传入数据，新增时传 undefined
                    />
                )}
            </div>

            {/* 任务列表区域 */}
            <div className="task-section">
                <h2>Current Tasks</h2>
                
                {/* 任务列表组件 */}
                <TaskList
                    tasks={tasks}                      // 传递任务数组
                    onEdit={handleEditTask}            // 编辑按钮点击时调用
                    onDelete={handleDeleteTask}        // 删除按钮点击时调用
                    onToggle={handleToggleTask}        // 复选框点击时调用
                />
            </div>
        </div>
    );
}

// 导出 App 组件，供 main.tsx 使用
export default App;