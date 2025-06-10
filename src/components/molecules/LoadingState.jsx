import React from 'react';

function LoadingState() {
  return (
    <div className="h-screen flex">
      <div className="w-80 bg-surface-50 p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-surface-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingState;