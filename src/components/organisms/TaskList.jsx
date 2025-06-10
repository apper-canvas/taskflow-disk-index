import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import Kbd from '@/components/atoms/Kbd';

function TaskList({ tasks, categories, onToggleTask, onDeleteTask, statusFilter }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

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
      <EmptyState
        statusFilter={statusFilter}
        onAddTaskFocus={() => document.querySelector('input[placeholder*="Add a new task"]')?.focus()}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-3">
        <AnimatePresence>
          {sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onMouseEnter={setHoveredTask}
              onMouseLeave={setHoveredTask}
              draggedTask={draggedTask}
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              transition={{ delay: index * 0.05 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {hoveredTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-30"
        >
          Press <Kbd>Space</Kbd> to toggle completion
        </motion.div>
      )}
    </div>
  );
}

export default TaskList;