import React from 'react';

export default function ClubsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-10">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-elevated rounded-full"></div>
        <div className="h-12 w-3/4 max-w-lg bg-elevated rounded-2xl"></div>
        <div className="h-6 w-full max-w-2xl bg-elevated rounded-full"></div>
      </div>

      {/* Filter Skeleton */}
      <div className="h-16 bg-surface rounded-2xl w-full"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-surface rounded-3xl border border-border"></div>
        ))}
      </div>
    </div>
  );
}
