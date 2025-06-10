import React from 'react';

function Input({ type = 'text', value, onChange, placeholder, className, forwardedRef, ...props }) {
  return (
    <input
      ref={forwardedRef}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus-ring font-medium text-gray-900 placeholder-gray-500 ${className || ''}`}
      {...props}
    />
  );
}

export default Input;