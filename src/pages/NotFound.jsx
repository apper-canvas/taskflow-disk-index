import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12 px-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <ApperIcon name="Search" className="w-20 h-20 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back to organizing your tasks.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            Back to Tasks
          </NavLink>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;