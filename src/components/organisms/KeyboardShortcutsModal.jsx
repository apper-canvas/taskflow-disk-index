import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Kbd from '@/components/atoms/Kbd';
import Button from '@/components/atoms/Button';

function KeyboardShortcutsModal({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 keyboard-shortcuts"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-semibold text-lg mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>New task</span>
                <Kbd>Ctrl + N</Kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Toggle completion</span>
                <Kbd>Space</Kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Show shortcuts</span>
                <Kbd>?</Kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Close shortcuts</span>
                <Kbd>Esc</Kbd>
              </div>
            </div>
            <Button onClick={onClose} className="mt-4 w-full">
              Got it
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default KeyboardShortcutsModal;