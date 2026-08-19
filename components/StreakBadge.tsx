import React from 'react';
import { Flame, Trophy, Percent } from 'lucide-react';

interface StreakBadgeProps {
  currentWeeks: number;
  totalCheckins: number;
  discountPct: number;
}

export default function StreakBadge({ currentWeeks, totalCheckins, discountPct }: StreakBadgeProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-surface to-elevated border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange/10 border border-orange/30 flex items-center justify-center text-orange glow-orange">
            <Flame className="w-5 h-5 fill-orange" />
          </div>
          <div>
            <div className="text-xs font-mono text-textMuted uppercase tracking-wider">Consistency Streak</div>
            <div className="text-sm sm:text-base font-display font-extrabold text-textPrimary">
              {currentWeeks} Minggu Berturut-turut! 🔥
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-volt/10 text-volt border border-volt/30 text-xs font-mono">
          <Percent className="w-3.5 h-3.5" />
          <span>Diskon {discountPct}% Renewal</span>
        </div>
      </div>

      {/* Progress Bar towards Next Milestone */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-textMuted">
          <span>Target: 12 Minggu ({currentWeeks}/12)</span>
          <span className="text-volt">Total {totalCheckins}x Check-in</span>
        </div>
        <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/60">
          <div
            style={{ width: `${Math.min(100, (currentWeeks / 12) * 100)}%` }}
            className="h-full bg-gradient-to-r from-orange via-volt to-cyan rounded-full transition-all duration-700"
          ></div>
        </div>
      </div>
    </div>
  );
}
