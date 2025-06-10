import React from 'react';
import ApperIcon from '@/components/ApperIcon';

function CategorySidebar({ categories, activeCategory, setActiveCategory, allTasksCount, tasks }) {
  return (
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
            <span className="text-sm opacity-75">{allTasksCount}</span>
          </button>

          {categories.map(category => {
            const categoryTasksCount = tasks.filter(t => t.categoryId === category.id).length;
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
                <span className="text-sm opacity-75">{categoryTasksCount}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;