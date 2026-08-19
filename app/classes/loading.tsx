import React from 'react';

export default function ClassesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-10">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-elevated rounded-full"></div>
        <div className="h-12 w-3/4 max-w-lg bg-elevated rounded-2xl"></div>
      </div>

      {/* Days Selector Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-20 bg-surface rounded-2xl border border-border"></div>
        ))}
      </div>

      {/* Categories Skeleton */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-surface rounded-xl border border-border"></div>
        ))}
      </div>

      {/* Classes Grid Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-surface rounded-3xl border border-border"></div>
        ))}
      </div>
    </div>
  );
}
