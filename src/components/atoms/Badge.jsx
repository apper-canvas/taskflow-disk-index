import React from 'react';
import ApperIcon from '@/components/ApperIcon';

function Badge({ children, className, icon, dotColor, ...props }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className || ''}`} {...props}>
      {dotColor && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }}></div>}
      {icon && <ApperIcon name={icon} size={12} />}
      {children}
    </span>
  );
}

export default Badge;