import React from 'react';

interface LiveCrowdBadgeProps {
  level: 'LOW' | 'MODERATE' | 'BUSY' | string;
  occupancyPct?: number;
  showPercent?: boolean;
  onClick?: () => void;
}

export default function LiveCrowdBadge({
  level,
  occupancyPct,
  showPercent = true,
  onClick,
}: LiveCrowdBadgeProps) {
  let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotClass = 'bg-emerald-400';
  let label = 'Lengang';

  if (level === 'MODERATE') {
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotClass = 'bg-amber-400';
    label = 'Sedang';
  } else if (level === 'BUSY' || level === 'OVERCROWDED') {
    colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotClass = 'bg-rose-400';
    label = 'Padat';
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium transition-all ${colorClass} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`}></span>
      </span>
      <span>
        {label} {showPercent && occupancyPct !== undefined && `(${occupancyPct}%)`}
      </span>
    </div>
  );
}
