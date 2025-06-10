import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import { taskService, categoryService } from '../services';

function Home() {
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
    return (
      <div className="h-screen flex">
        <div className="w-80 bg-surface-50 p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-surface-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Quick Add Bar */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                ref={taskInputRef}
                type="text"
                placeholder="Add a new task... (Ctrl+N)"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && createTask()}
                className="w-full px-4 py-3 border border-surface-300 rounded-lg focus-ring font-medium text-gray-900 placeholder-gray-500"
              />
            </div>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-3 border border-surface-300 rounded-lg focus-ring"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={newTask.categoryId}
              onChange={(e) => setNewTask(prev => ({ ...prev, categoryId: e.target.value }))}
              className="px-3 py-3 border border-surface-300 rounded-lg focus-ring"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-3 border border-surface-300 rounded-lg focus-ring"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createTask}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Add Task
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex-shrink-0 bg-surface-50 border-b border-surface-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-6 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-surface-100'
              }`}
            >
              Active ({activeTasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-600 hover:bg-surface-100'
              }`}
            >
              Completed ({completedTasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-surface-100'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          <div className="h-4 w-px bg-surface-300"></div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-surface-300 rounded-lg text-sm focus-ring"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
          >
            <ApperIcon name="Keyboard" size={16} />
            Shortcuts (?)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-80 bg-surface-50 border-r border-surface-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="font-heading font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-surface-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ApperIcon name="List" size={16} />
                  All Tasks
                </span>
                <span className="text-sm opacity-75">{tasks.length}</span>
              </button>
              
              {categories.map(category => {
                const categoryTasks = tasks.filter(t => t.categoryId === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-surface-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                    </span>
                    <span className="text-sm opacity-75">{categoryTasks.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          <MainFeature 
            tasks={filteredTasks}
            categories={categories}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            statusFilter={statusFilter}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 keyboard-shortcuts"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-heading font-semibold text-lg mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>New task</span>
                  <kbd className="px-2 py-1 bg-surface-100 rounded text-sm">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Toggle completion</span>
                  <kbd className="px-2 py-1 bg-surface-100 rounded text-sm">Space</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Show shortcuts</span>
                  <kbd className="px-2 py-1 bg-surface-100 rounded text-sm">?</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Close shortcuts</span>
                  <kbd className="px-2 py-1 bg-surface-100 rounded text-sm">Esc</kbd>
                </div>
              </div>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;