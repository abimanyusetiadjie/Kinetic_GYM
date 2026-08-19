'use client';

import React from 'react';
import {
  X,
  TrendingUp,
  Clock,
  TrendingDown,
  Users,
  CheckCircle2,
  Navigation,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface HourlyForecastItem {
  hour: number;
  occupancyPct: number;
  isBestTime?: boolean;
}

export interface GenericClubForecast {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  capacityPct?: number;
  currentOccupancyPct?: number;
  hourlyForecast?: HourlyForecastItem[];
}

interface PredictiveCrowdModalProps {
  club: GenericClubForecast | null;
  onClose: () => void;
}

export default function PredictiveCrowdModal({ club, onClose }: PredictiveCrowdModalProps) {
  if (!club) return null;

  const currentOccupancy = club.currentOccupancyPct ?? club.capacityPct ?? 54;
  const defaultForecast: HourlyForecastItem[] = [
    { hour: 6, occupancyPct: 25 },
    { hour: 8, occupancyPct: 68 },
    { hour: 12, occupancyPct: 50 },
    { hour: 14, occupancyPct: 22, isBestTime: true },
    { hour: 16, occupancyPct: 35, isBestTime: true },
    { hour: 18, occupancyPct: 88 },
    { hour: 20, occupancyPct: 75 },
    { hour: 22, occupancyPct: 30 },
  ];

  const forecastData = club.hourlyForecast && club.hourlyForecast.length > 0 ? club.hourlyForecast : defaultForecast;
  const mapSearchQuery = encodeURIComponent(`${club.name} ${club.address || club.city || ''}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;
  const wazeUrl = `https://waze.com/ul?q=${mapSearchQuery}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-volt to-transparent"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Predictive Crowd AI & Navigasi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-textPrimary">
              {club.name}
            </h3>
            {club.address && (
              <div className="flex items-center gap-1.5 text-xs text-textMuted mt-1">
                <MapPin className="w-3.5 h-3.5 text-volt shrink-0" />
                <span>{club.address}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-xl bg-elevated hover:bg-surface border border-border text-textMuted hover:text-textPrimary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Live Snapshot */}
        <div className="my-6 p-4 rounded-2xl bg-elevated/70 border border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-volt/10 border border-volt/30 flex items-center justify-center text-volt">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-textMuted">Kepadatan Saat Ini</div>
              <div className="text-base font-bold text-textPrimary flex items-center gap-2">
                <span>{currentOccupancy}% Kapasitas</span>
                <span className="text-xs font-mono text-cyan">● Sensor Real-time</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-volt/10 border border-volt/30 px-3 py-1.5 rounded-xl text-volt text-xs font-mono font-bold">
            <Clock className="w-4 h-4" />
            <span>Jam Rekomendasi: 14:00 - 16:00</span>
          </div>
        </div>

        {/* Hourly Forecast Bar Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-textMuted">
            <span>Grafik Perkiraan Per Jam (Hari Ini)</span>
            <span className="text-volt flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Jam Lengang Terbaik
            </span>
          </div>

          <div className="grid grid-cols-8 gap-2 pt-4 pb-2 items-end h-40 bg-background/50 p-4 rounded-2xl border border-border">
            {forecastData.map((item) => {
              const isBest = item.isBestTime;
              return (
                <div key={item.hour} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-textMuted opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.occupancyPct}%
                  </span>
                  <div className="w-full max-w-[28px] bg-elevated rounded-t-lg relative overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${item.occupancyPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isBest
                          ? 'bg-volt shadow-[0_0_12px_rgba(202,255,51,0.5)]'
                          : item.occupancyPct > 70
                          ? 'bg-rose-500/80'
                          : 'bg-cyan/60'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-mono ${isBest ? 'text-volt font-bold' : 'text-textMuted'}`}>
                    {String(item.hour).padStart(2, '0')}:00
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Tips */}
        <div className="mt-6 p-4 rounded-2xl bg-volt/5 border border-volt/20 flex items-start gap-3 text-xs text-textMuted">
          <TrendingDown className="w-5 h-5 text-volt shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-textPrimary font-semibold">Tips Cerdas:</strong> Datang antara pukul{' '}
            <span className="text-volt font-bold">14:00 - 16:00</span> memberikan Anda akses bebas antrean di area Free Weight Rack dan Sauna.
          </p>
        </div>

        {/* Direct Maps & Waze Deep-link Actions */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-textPrimary hover:text-volt flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Waze GPS</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8ea29] transition-all cursor-pointer glow-volt"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
