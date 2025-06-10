import React from 'react';

function Select({ value, onChange, options, className, ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-3 border border-surface-300 rounded-lg focus-ring ${className || ''}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export default Select;