import { useState, useEffect } from 'react';
import './App.css';
import { TaskItem } from './types';
import { taskService } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const handleEditTask = (task: TaskItem) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const handleSubmitTask = async (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'completedAt'>) => {
        try {
            if (editingTask) {
                const updatedTask = { ...editingTask, ...taskData };
                await taskService.updateTask(editingTask.id, updatedTask);
            } else {
                await taskService.createTask(taskData);
            }
            fetchTasks();
            setShowForm(false);
            setEditingTask(null);
        } catch (err) {
            setError('Failed to save task');
            console.error('Error saving task:', err);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (err) {
                setError('Failed to delete task');
                console.error('Error deleting task:', err);
            }
        }
    };

    const handleToggleTask = async (id: number, isCompleted: boolean) => {
        try {
            await taskService.toggleTaskCompletion(id, isCompleted);
            fetchTasks();
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    if (error) {
        return <div>Error: {error}. <button onClick={fetchTasks}>Retry</button></div>;
    }

    return (
        <div className="App">
            <h1>Task Manager</h1>

            <div className="card">
                {/* ⬇️⬇️⬇️ 这里是改动的地方 ⬇️⬇️⬇️ */}
                {/* 添加新任务按钮 - 只在表单未显示时展示 */}
                {!showForm && (
                    <button onClick={handleAddTask}>
                        Add New Task
                    </button>
                )}
                {/* ⬆️⬆️⬆️ 改动结束 ⬆️⬆️⬆️ */}

                {showForm && (
                    <TaskForm
                        onSubmit={handleSubmitTask}
                        onCancel={handleCancelForm}
                        initialData={editingTask || undefined}
                    />
                )}
            </div>

            <div className="task-section">
                <h2>Current Tasks</h2>
                <TaskList
                    tasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggle={handleToggleTask}
                />
            </div>
        </div>
    );
}

export default App;