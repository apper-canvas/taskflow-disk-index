import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

function TaskCard({ task, category, onToggle, onDelete, onMouseEnter, onMouseLeave, draggedTask, ...motionProps }) {
  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
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

  const dueDateText = formatDueDate(task.dueDate);
  const dueDateColorClass = getDueDateColor(task.dueDate);

  // Destructure props to prevent passing non-HTML attributes to DOM element
  const { onDragStart, onDragOver, onDrop, ...restMotionProps } = motionProps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: task.completed ? 0.7 : 1,
        y: 0,
        scale: task.completed ? 0.98 : 1
      }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, delay: motionProps.transition?.delay || 0 }}
      layout
      draggable={!task.completed}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, task)}
      onMouseEnter={() => onMouseEnter(task.id)}
      onMouseLeave={() => onMouseLeave(null)}
      className={`
        bg-white rounded-lg border border-surface-200 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        ${task.completed ? 'opacity-75' : ''}
        ${draggedTask?.id === task.id ? 'opacity-50 rotate-2' : ''}
        ${priorityColors[task.priority]}
        cursor-pointer group relative
      `}
      whileHover={{ scale: task.completed ? 0.98 : 1.02 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />

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
                  <Badge
                    className={`${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                    icon={task.priority === 'high' ? 'AlertTriangle' : task.priority === 'medium' ? 'Clock' : 'CheckCircle'}
                  >
                    {task.priority} priority
                  </Badge>

                  {category && (
                    <Badge className="bg-surface-100 text-surface-700" dotColor={category.color}>
                      {category.name}
                    </Badge>
                  )}

                  {dueDateText && (
                    <Badge className={`${dueDateColorClass}`} icon="Calendar">
                      {dueDateText}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  variant="red-link"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
}

export default TaskCard;