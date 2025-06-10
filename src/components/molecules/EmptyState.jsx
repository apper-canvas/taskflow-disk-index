import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function EmptyState({ statusFilter, onAddTaskFocus }) {
  const isCompletedFilter = statusFilter === 'completed';

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
            name={isCompletedFilter ? 'CheckCircle' : 'ListTodo'}
            className="w-20 h-20 text-surface-300 mx-auto"
          />
        </motion.div>

        <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3">
          {isCompletedFilter ? 'No completed tasks' : 'No tasks yet'}
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {isCompletedFilter
            ? 'Complete some tasks to see them here. Completed tasks are automatically archived after 24 hours.'
            : 'Start organizing your day by adding your first task. Use Ctrl+N to quickly add a new task.'
          }
        </p>

        {!isCompletedFilter && (
          <Button
            onClick={onAddTaskFocus}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Your First Task
          </Button>
        )}
      </motion.div>
    </div>
  );
}

export default EmptyState;