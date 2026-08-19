'use client';

import React, { useState } from 'react';
import {
  Flame,
  Activity,
  Heart,
  Scale,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Dumbbell,
  CheckCircle2,
  Droplets,
} from 'lucide-react';

interface WorkoutSession {
  id: string;
  date: string;
  activity: string;
  durationMins: number;
  caloriesBurned: number;
  avgHeartRate: number;
  location: string;
}

export default function WorkoutAnalytics() {
  // Interactive BMI Calculator State
  const [weightKg, setWeightKg] = useState(72);
  const [heightCm, setHeightCm] = useState(175);

  // Initial Workout History
  const [history] = useState<WorkoutSession[]>([
    {
      id: 'ws_1',
      date: 'Hari Ini, 07:15 WIB',
      activity: 'Les Mills BodyPump (Full Body)',
      durationMins: 55,
      caloriesBurned: 580,
      avgHeartRate: 142,
      location: 'Sudirman SCBD (Studio 1)',
    },
    {
      id: 'ws_2',
      date: 'Kemarin, 18:30 WIB',
      activity: 'RPM Indoor Cycling (High Intensity)',
      durationMins: 45,
      caloriesBurned: 620,
      avgHeartRate: 158,
      location: 'Sudirman SCBD (Cycling Room)',
    },
    {
      id: 'ws_3',
      date: '14 Agt 2026, 17:00 WIB',
      activity: 'Boxing Conditioning & Free Weights',
      durationMins: 60,
      caloriesBurned: 690,
      avgHeartRate: 148,
      location: 'Kuningan City',
    },
    {
      id: 'ws_4',
      date: '12 Agt 2026, 06:45 WIB',
      activity: 'Power Flow Yoga & Core Mobility',
      durationMins: 50,
      caloriesBurned: 290,
      avgHeartRate: 112,
      location: 'Senopati Suites',
    },
  ]);

  // BMI Calculation
  const heightM = heightCm / 100;
  const bmiValue = (weightKg / (heightM * heightM)).toFixed(1);
  const bmiNum = parseFloat(bmiValue);

  let bmiCategory = 'Berat Ideal (Normal)';
  let bmiColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-cyan bg-cyan/10 border-cyan/30';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Overweight (Sedikit Berlebih)';
    bmiColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (bmiNum >= 30) {
    bmiCategory = 'Obesitas';
    bmiColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  // Target Protein & Water intake suggestion
  const recommendedProtein = (weightKg * 1.8).toFixed(0); // 1.8g per kg for active lifters
  const recommendedWater = (weightKg * 0.035).toFixed(1); // 35ml per kg

  return (
    <div className="space-y-8">
      {/* Lifetime Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-textMuted">
            <span>Total Kalori Terbakar</span>
            <Flame className="w-4 h-4 text-orange" />
          </div>
          <div className="text-2xl font-display font-extrabold text-orange">
            14.280 <span className="text-xs font-mono text-textMuted font-normal">kcal</span>
          </div>
          <div className="text-[10px] font-mono text-textMuted">Setara membakar ~1.85 kg lemak tubuh</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-textMuted">
            <span>Total Jam Latihan</span>
            <Clock className="w-4 h-4 text-cyan" />
          </div>
          <div className="text-2xl font-display font-extrabold text-cyan">
            28.5 <span className="text-xs font-mono text-textMuted font-normal">Jam</span>
          </div>
          <div className="text-[10px] font-mono text-textMuted">Rata-rata 55 menit per sesi gym</div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-textMuted">
            <span>Konsistensi Bulanan</span>
            <TrendingUp className="w-4 h-4 text-volt" />
          </div>
          <div className="text-2xl font-display font-extrabold text-volt">
            18 <span className="text-xs font-mono text-textMuted font-normal">/ 20 Hari Target</span>
          </div>
          <div className="text-[10px] font-mono text-textMuted">Progres 90% tercapai bulan ini! 🔥</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-textMuted">
            <span>Detak Jantung Rata-rata</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-textPrimary">
            145 <span className="text-xs font-mono text-textMuted font-normal">BPM</span>
          </div>
          <div className="text-[10px] font-mono text-textMuted">Zona Kardio & Fat Burn Optimal</div>
        </div>
      </div>

      {/* Interactive Body Composition & BMI Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-volt uppercase tracking-wider">
              Smart Body Metric AI
            </div>
            <h3 className="text-xl font-display font-extrabold text-textPrimary">
              Kalkulator BMI & Rekomendasi Nutrisi Harian
            </h3>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${bmiColor}`}>
            {bmiCategory} (BMI: {bmiValue})
          </div>
        </div>

        {/* Sliders Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Slider */}
          <div className="p-5 rounded-2xl bg-elevated/70 border border-border space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-textMuted flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-volt" /> Berat Badan
              </span>
              <span className="text-lg font-bold text-volt">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min="40"
              max="140"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              aria-label="Berat Badan (kg)"
              className="w-full accent-volt cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-textMuted">
              <span>40 kg</span>
              <span>90 kg</span>
              <span>140 kg</span>
            </div>
          </div>

          {/* Height Slider */}
          <div className="p-5 rounded-2xl bg-elevated/70 border border-border space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-textMuted flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan" /> Tinggi Badan
              </span>
              <span className="text-lg font-bold text-cyan">{heightCm} cm</span>
            </div>
            <input
              type="range"
              min="140"
              max="210"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              aria-label="Tinggi Badan (cm)"
              className="w-full accent-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-textMuted">
              <span>140 cm</span>
              <span>175 cm</span>
              <span>210 cm</span>
            </div>
          </div>
        </div>

        {/* Nutrition Tips based on BMI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-volt/5 border border-volt/20 flex items-center gap-3">
            <Dumbbell className="w-5 h-5 text-volt shrink-0" />
            <div className="text-xs font-mono">
              <div className="text-textMuted">Saran Asupan Protein Harian:</div>
              <div className="text-textPrimary font-bold text-sm">~{recommendedProtein} gram / hari</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan/5 border border-cyan/20 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan shrink-0" />
            <div className="text-xs font-mono">
              <div className="text-textMuted">Saran Hidrasi Air Putih:</div>
              <div className="text-textPrimary font-bold text-sm">~{recommendedWater} Liter / hari</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Log History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-extrabold text-textPrimary">
            Riwayat Sesi Latihan & Kelas Terakhir
          </h3>
          <span className="text-xs font-mono text-textMuted">Tersinkronisasi dari Gate IoT</span>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-elevated/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange/10 text-orange border border-orange/30 flex items-center justify-center font-bold text-xs shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-textPrimary">{item.activity}</div>
                  <div className="text-[11px] text-textMuted mt-0.5">
                    {item.date} • {item.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-volt font-bold text-sm">+{item.caloriesBurned} kcal</div>
                  <div className="text-[10px] text-textMuted">{item.durationMins} Menit • Avg {item.avgHeartRate} BPM</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  SELESAI
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
