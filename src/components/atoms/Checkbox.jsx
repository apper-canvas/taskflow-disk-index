import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function Checkbox({ checked, onChange }) {
  return (
    <motion.button
      onClick={onChange}
      className="mt-1 flex-shrink-0"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${checked
            ? 'bg-accent border-accent text-white animate-checkbox-fill'
            : 'border-surface-400 hover:border-accent'
          }
        `}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.1
            }}
          >
            <ApperIcon name="Check" size={12} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

export default Checkbox;