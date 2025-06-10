import React from 'react';

function Kbd({ children, className }) {
  return (
    <kbd className={`px-2 py-1 bg-surface-100 rounded text-sm ${className || ''}`}>
      {children}
    </kbd>
  );
}

export default Kbd;