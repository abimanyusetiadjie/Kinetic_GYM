'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('7D');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs font-mono text-cyan hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dasbor Utama
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-textPrimary">
            Analytics & Reports
          </h1>
          <p className="text-sm text-textMuted font-mono">
            Tinjauan performa pendapatan, check-in cabang, dan metrik operasional.
          </p>
        </div>
        <div className="flex bg-surface border border-border rounded-xl p-1">
          {['Hari Ini', '7D', '30D', 'YTD'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                timeRange === range
                  ? 'bg-volt text-black shadow-sm'
                  : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-textMuted text-xs font-mono mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Total Pendapatan</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-textPrimary mb-1">
            Rp 128.4M
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
            +14.2% vs periode lalu
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-textMuted text-xs font-mono mb-2">
            <Users className="w-4 h-4 text-cyan" />
            <span>Total Check-ins</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-textPrimary mb-1">
            24,892
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
            +5.8% vs periode lalu
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-textMuted text-xs font-mono mb-2">
            <Calendar className="w-4 h-4 text-volt" />
            <span>Booking Kelas</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-textPrimary mb-1">
            8,430
          </div>
          <div className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded inline-block">
            -2.1% vs periode lalu
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-textMuted text-xs font-mono mb-2">
            <TrendingUp className="w-4 h-4 text-orange" />
            <span>Anggota Aktif (MAU)</span>
          </div>
          <div className="text-2xl font-display font-extrabold text-textPrimary mb-1">
            15,201
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
            +8.4% vs periode lalu
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue by Category */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
          <h3 className="text-sm font-display font-extrabold text-textPrimary">
            Komposisi Pendapatan
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-textMuted">Membership Online</span>
                <span className="text-textPrimary font-bold">Rp 84.2M (65%)</span>
              </div>
              <div className="w-full h-3 bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-volt w-[65%]"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-textMuted">Kasir POS (Walk-in/F&B)</span>
                <span className="text-textPrimary font-bold">Rp 25.6M (20%)</span>
              </div>
              <div className="w-full h-3 bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-cyan w-[20%]"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-textMuted">Paket Personal Trainer</span>
                <span className="text-textPrimary font-bold">Rp 18.6M (15%)</span>
              </div>
              <div className="w-full h-3 bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Top Branches Check-in */}
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-6">
          <h3 className="text-sm font-display font-extrabold text-textPrimary">
            5 Cabang Teramai (Check-ins)
          </h3>
          <div className="flex items-end gap-2 h-40 pt-4">
            {[
              { label: 'Sudirman', value: 85, color: 'bg-volt' },
              { label: 'Senopati', value: 65, color: 'bg-cyan' },
              { label: 'K. Gading', value: 50, color: 'bg-emerald-400' },
              { label: 'Dago BDG', value: 45, color: 'bg-orange' },
              { label: 'Seminyak', value: 70, color: 'bg-rose-400' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                <div className="text-[10px] font-mono text-textPrimary opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.value * 120}
                </div>
                <div 
                  className={`w-full max-w-[40px] rounded-t-md ${bar.color} transition-all duration-500`} 
                  style={{ height: `${bar.value}%` }}
                ></div>
                <div className="text-[9px] font-mono text-textMuted text-center hidden sm:block">
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Peak Hours Curve */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-border space-y-6">
          <h3 className="text-sm font-display font-extrabold text-textPrimary">
            Kurva Kepadatan Jam Operasional (Rata-rata 7 Hari Terakhir)
          </h3>
          <div className="relative h-48 w-full border-b border-l border-border/50 pt-4 pr-2">
            {/* CSS Curve Visualization (Simplified) */}
            <div className="absolute inset-0 flex items-end px-2 pb-[1px]">
              {[
                { h: '06:00', v: 20 }, { h: '08:00', v: 45 }, { h: '10:00', v: 30 },
                { h: '12:00', v: 25 }, { h: '14:00', v: 20 }, { h: '16:00', v: 50 },
                { h: '18:00', v: 95 }, { h: '20:00', v: 75 }, { h: '22:00', v: 15 }
              ].map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group">
                  <div 
                    className="w-full max-w-[8px] bg-gradient-to-t from-cyan/20 to-cyan rounded-t-full transition-all"
                    style={{ height: `${point.v}%` }}
                  ></div>
                  <div className="absolute -bottom-6 text-[9px] font-mono text-textMuted">
                    {point.h}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-6"></div> {/* Spacer for bottom labels */}
        </div>
      </div>
    </div>
  );
}
