import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function ErrorState({ message, onRetry }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tasks</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <Button
          onClick={onRetry}
          className="px-4 py-2"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default ErrorState;