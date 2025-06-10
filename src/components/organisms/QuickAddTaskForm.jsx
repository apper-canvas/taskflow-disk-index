import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

function QuickAddTaskForm({ newTask, setNewTask, categories, onCreateTask, taskInputRef }) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-surface-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              forwardedRef={taskInputRef}
              placeholder="Add a new task... (Ctrl+N)"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && onCreateTask()}
            />
          </div>
          <Select
            value={newTask.priority}
            onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
            options={[
              { value: 'low', label: 'Low Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'high', label: 'High Priority' }
            ]}
          />
          <Select
            value={newTask.categoryId}
            onChange={(e) => setNewTask(prev => ({ ...prev, categoryId: e.target.value }))}
            options={[
              { value: '', label: 'Select Category' },
              ...categories.map(category => ({ value: category.id, label: category.name }))
            ]}
          />
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
          />
          <Button onClick={onCreateTask}>
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuickAddTaskForm;