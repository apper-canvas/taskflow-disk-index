import React from 'react';
import { motion } from 'framer-motion';

function Button({ onClick, children, className, variant = 'primary', ...props }) {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-white text-gray-600 border border-surface-300 hover:bg-surface-100",
    'light-hover': "bg-surface-100 hover:bg-surface-200 text-gray-700",
    'red-link': "p-1.5 text-gray-400 hover:text-red-500",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;