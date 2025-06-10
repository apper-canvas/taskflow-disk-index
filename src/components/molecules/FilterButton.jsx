import React from 'react';

function FilterButton({ onClick, active, children, activeColorClass, inactiveColorClass, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active ? activeColorClass : inactiveColorClass
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default FilterButton;