import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';

function MainFeature({ tasks, categories, onToggleTask, onDeleteTask, statusFilter }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const taskRefs = useRef({});

  // Keyboard navigation for task completion
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.key === ' ' && hoveredTask && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onToggleTask(hoveredTask);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [hoveredTask, onToggleTask]);

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue - ${format(date, 'MMM d')}`;
    return format(date, 'MMM d');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) return 'text-red-500';
    if (isToday(date)) return 'text-orange-500';
    return 'text-gray-500';
  };

  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
  };

  const priorityBgs = {
    high: 'bg-red-50',
    medium: 'bg-yellow-50',
    low: 'bg-green-50'
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority (high to low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (draggedTask && draggedTask.id !== targetTask.id) {
      // In a real app, you would update the order in the backend
      console.log('Reordering tasks:', draggedTask.title, 'to position of', targetTask.title);
    }
    setDraggedTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-6"
          >
            <ApperIcon 
              name={statusFilter === 'completed' ? 'CheckCircle' : 'ListTodo'} 
              className="w-20 h-20 text-surface-300 mx-auto" 
            />
          </motion.div>
          
          <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3">
            {statusFilter === 'completed' ? 'No completed tasks' : 'No tasks yet'}
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {statusFilter === 'completed' 
              ? 'Complete some tasks to see them here. Completed tasks are automatically archived after 24 hours.'
              : 'Start organizing your day by adding your first task. Use Ctrl+N to quickly add a new task.'
            }
          </p>
          
          {statusFilter !== 'completed' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium cursor-pointer"
              onClick={() => document.querySelector('input[placeholder*="Add a new task"]')?.focus()}
            >
              <ApperIcon name="Plus" size={20} />
              Add Your First Task
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-3">
        <AnimatePresence>
          {sortedTasks.map((task, index) => {
            const category = getCategoryById(task.categoryId);
            const dueDateText = formatDueDate(task.dueDate);
            const dueDateColor = getDueDateColor(task.dueDate);
            
            return (
              <motion.div
                key={task.id}
                ref={el => taskRefs.current[task.id] = el}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: task.completed ? 0.7 : 1, 
                  y: 0,
                  scale: task.completed ? 0.98 : 1
                }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                layout
                draggable={!task.completed}
                onDragStart={(e) => handleDragStart(e, task)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task)}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
                className={`
                  bg-white rounded-lg border border-surface-200 shadow-sm
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                  ${task.completed ? 'opacity-75' : ''}
                  ${draggedTask?.id === task.id ? 'opacity-50 rotate-2' : ''}
                  ${priorityColors[task.priority]} priority-${task.priority}
                  cursor-pointer
                `}
                whileHover={{ scale: task.completed ? 0.98 : 1.02 }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Completion Checkbox */}
                    <motion.button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-1 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div 
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                          ${task.completed 
                            ? 'bg-accent border-accent text-white animate-checkbox-fill' 
                            : 'border-surface-400 hover:border-accent'
                          }
                        `}
                      >
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 30,
                              delay: 0.1 
                            }}
                          >
                            <ApperIcon name="Check" size={12} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className={`
                            font-medium text-gray-900 break-words
                            ${task.completed ? 'line-through text-gray-500' : ''}
                          `}>
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p className={`
                              mt-1 text-sm text-gray-600 break-words
                              ${task.completed ? 'line-through opacity-75' : ''}
                            `}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-3">
                            {/* Priority Badge */}
                            <span className={`
                              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                              ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                              ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                              ${task.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                            `}>
                              <ApperIcon 
                                name={task.priority === 'high' ? 'AlertTriangle' : task.priority === 'medium' ? 'Clock' : 'CheckCircle'} 
                                size={12} 
                              />
                              {task.priority} priority
                            </span>
                            
                            {/* Category Badge */}
                            {category && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-medium">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </span>
                            )}
                            
                            {/* Due Date */}
                            {dueDateText && (
                              <span className={`inline-flex items-center gap-1 text-xs font-medium ${dueDateColor}`}>
                                <ApperIcon name="Calendar" size={12} />
                                {dueDateText}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Animation Overlay */}
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" size={24} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Keyboard Hint */}
      {hoveredTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-30"
        >
          Press <kbd className="bg-gray-700 px-1 rounded">Space</kbd> to toggle completion
        </motion.div>
      )}
    </div>
  );
}

export default MainFeature;