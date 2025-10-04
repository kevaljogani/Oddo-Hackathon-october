import React from 'react';

/**
 * Loading skeleton component with animated placeholders
 * Uses reactbits.dev animation patterns for smooth loading states
 */
const LoadingSkeleton = ({ type = 'page' }) => {
  // Animated shimmer effect using CSS classes
  const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

  if (type === 'page') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className={`h-8 w-48 rounded ${shimmerClass}`}></div>
            <div className={`h-10 w-32 rounded ${shimmerClass}`}></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6">
                <div className={`h-4 w-24 rounded mb-2 ${shimmerClass}`}></div>
                <div className={`h-8 w-16 rounded mb-4 ${shimmerClass}`}></div>
                <div className={`h-3 w-32 rounded ${shimmerClass}`}></div>
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className={`h-6 w-40 rounded ${shimmerClass}`}></div>
            </div>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`h-4 w-4 rounded ${shimmerClass}`}></div>
                  <div className={`h-4 flex-1 rounded ${shimmerClass}`}></div>
                  <div className={`h-4 w-20 rounded ${shimmerClass}`}></div>
                  <div className={`h-4 w-16 rounded ${shimmerClass}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className={`h-4 w-8 rounded ${shimmerClass}`}></div>
            <div className={`h-4 flex-1 rounded ${shimmerClass}`}></div>
            <div className={`h-4 w-24 rounded ${shimmerClass}`}></div>
            <div className={`h-4 w-20 rounded ${shimmerClass}`}></div>
            <div className={`h-4 w-16 rounded ${shimmerClass}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className={`h-4 w-32 rounded mb-4 ${shimmerClass}`}></div>
        <div className="space-y-3">
          <div className={`h-4 w-full rounded ${shimmerClass}`}></div>
          <div className={`h-4 w-3/4 rounded ${shimmerClass}`}></div>
          <div className={`h-4 w-1/2 rounded ${shimmerClass}`}></div>
        </div>
        <div className={`h-10 w-24 rounded mt-6 ${shimmerClass}`}></div>
      </div>
    );
  }

  // Default small loading spinner
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default LoadingSkeleton;