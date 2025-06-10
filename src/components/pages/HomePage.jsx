import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import QuickAddTaskForm from '@/components/organisms/QuickAddTaskForm';
import TaskFilterToolbar from '@/components/organisms/TaskFilterToolbar';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskList from '@/components/organisms/TaskList';
import KeyboardShortcutsModal from '@/components/organisms/KeyboardShortcutsModal';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    categoryId: '',
    dueDate: ''
  });

  const taskInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        taskInputRef.current?.focus();
      }
      if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
      if (e.key === 'Escape') {
        setShowKeyboardShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [showKeyboardShortcuts]);

  // Auto-archive completed tasks after 24 hours
  useEffect(() => {
    const archiveOldTasks = () => {
      const now = new Date();
      const updatedTasks = tasks.filter(task => {
        if (task.completed && task.completedAt) {
          const completedTime = new Date(task.completedAt);
          const hoursDiff = (now - completedTime) / (1000 * 60 * 60);
          return hoursDiff < 24; // Keep if completed less than 24 hours ago
        }
        return true; // Keep all non-completed tasks
      });

      if (updatedTasks.length !== tasks.length) {
        setTasks(updatedTasks);
        toast.info('Completed tasks older than 24 hours have been archived');
      }
    };

    const interval = setInterval(archiveOldTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate || null,
        categoryId: newTask.categoryId || categories[0]?.id || null
      };

      const createdTask = await taskService.create(taskData);
      setTasks(prev => [createdTask, ...prev]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        categoryId: '',
        dueDate: ''
      });
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeCategory !== 'all' && task.categoryId !== activeCategory) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <QuickAddTaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        categories={categories}
        onCreateTask={createTask}
        taskInputRef={taskInputRef}
      />

      <TaskFilterToolbar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        activeTasksCount={activeTasks.length}
        completedTasksCount={completedTasks.length}
        allTasksCount={tasks.length}
        onShowShortcuts={() => setShowKeyboardShortcuts(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          allTasksCount={tasks.length}
          tasks={tasks} // Pass all tasks to calculate category counts
        />

        <div className="flex-1 overflow-y-auto">
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            statusFilter={statusFilter}
          />
        </div>
      </div>

      <KeyboardShortcutsModal
        show={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}

export default HomePage;