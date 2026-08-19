import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 sm:h-96 bg-elevated rounded-3xl w-full mb-12"></div>
      
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-elevated rounded-3xl w-full"></div>
        ))}
      </div>
    </div>
  );
}
