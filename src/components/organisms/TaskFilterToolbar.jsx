import React from 'react';
import FilterButton from '@/components/molecules/FilterButton';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

function TaskFilterToolbar({ statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, activeTasksCount, completedTasksCount, allTasksCount, onShowShortcuts }) {
  return (
    <div className="flex-shrink-0 bg-surface-50 border-b border-surface-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex gap-6 items-center">
        <div className="flex gap-2">
          <FilterButton
            onClick={() => setStatusFilter('active')}
            active={statusFilter === 'active'}
            activeColorClass="bg-primary text-white"
            inactiveColorClass="bg-white text-gray-600 hover:bg-surface-100"
          >
            Active ({activeTasksCount})
          </FilterButton>
          <FilterButton
            onClick={() => setStatusFilter('completed')}
            active={statusFilter === 'completed'}
            activeColorClass="bg-accent text-white"
            inactiveColorClass="bg-white text-gray-600 hover:bg-surface-100"
          >
            Completed ({completedTasksCount})
          </FilterButton>
          <FilterButton
            onClick={() => setStatusFilter('all')}
            active={statusFilter === 'all'}
            activeColorClass="bg-gray-900 text-white"
            inactiveColorClass="bg-white text-gray-600 hover:bg-surface-100"
          >
            All ({allTasksCount})
          </FilterButton>
        </div>

        <div className="h-4 w-px bg-surface-300"></div>

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'high', label: 'High Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'low', label: 'Low Priority' }
          ]}
          className="text-sm"
        />

        <button
          onClick={onShowShortcuts}
          className="ml-auto text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          <ApperIcon name="Keyboard" size={16} />
          Shortcuts (?)
        </button>
      </div>
    </div>
  );
}

export default TaskFilterToolbar;