'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  LayoutGrid,
  Flame,
  Users,
  Calendar,
  ExternalLink,
  Download,
  ArrowRight,
  Zap,
  Heart,
  Radio
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';

export interface StudioSpot {
  seatNumber: number;
  label: string;
  row: string;
  zone: 'FRONT' | 'MIDDLE' | 'BACK';
  zoneTitle: string;
  isBooked: boolean;
  isFrontRow?: boolean;
}

interface StudioSpotPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  instructor: string;
  roomName: string;
  timeString: string;
  onConfirmSpot: (seat: StudioSpot) => void;
}

export default function StudioSpotPickerModal({
  isOpen,
  onClose,
  classNameTitle,
  instructor,
  roomName,
  timeString,
  onConfirmSpot,
}: StudioSpotPickerModalProps) {
  // 12-spot interactive cinema-style grid (3 rows x 4 cols) with Zone tags
  const [spots, setSpots] = useState<StudioSpot[]>([
    { seatNumber: 1, label: 'Mat A1', row: 'A (Depan)', zone: 'FRONT', zoneTitle: 'High-Energy Zone', isBooked: false, isFrontRow: true },
    { seatNumber: 2, label: 'Mat A2', row: 'A (Depan)', zone: 'FRONT', zoneTitle: 'High-Energy Zone', isBooked: true, isFrontRow: true },
    { seatNumber: 3, label: 'Mat A3', row: 'A (Depan)', zone: 'FRONT', zoneTitle: 'High-Energy Zone', isBooked: false, isFrontRow: true },
    { seatNumber: 4, label: 'Mat A4', row: 'A (Depan)', zone: 'FRONT', zoneTitle: 'High-Energy Zone', isBooked: false, isFrontRow: true },

    { seatNumber: 5, label: 'Mat B1', row: 'B (Tengah)', zone: 'MIDDLE', zoneTitle: 'Balanced View Zone', isBooked: false },
    { seatNumber: 6, label: 'Mat B2', row: 'B (Tengah)', zone: 'MIDDLE', zoneTitle: 'Balanced View Zone', isBooked: false },
    { seatNumber: 7, label: 'Mat B3', row: 'B (Tengah)', zone: 'MIDDLE', zoneTitle: 'Balanced View Zone', isBooked: true },
    { seatNumber: 8, label: 'Mat B4', row: 'B (Tengah)', zone: 'MIDDLE', zoneTitle: 'Balanced View Zone', isBooked: false },

    { seatNumber: 9, label: 'Mat C1', row: 'C (Belakang)', zone: 'BACK', zoneTitle: 'Beginner-Friendly Zone', isBooked: false },
    { seatNumber: 10, label: 'Mat C2', row: 'C (Belakang)', zone: 'BACK', zoneTitle: 'Beginner-Friendly Zone', isBooked: false },
    { seatNumber: 11, label: 'Mat C3', row: 'C (Belakang)', zone: 'BACK', zoneTitle: 'Beginner-Friendly Zone', isBooked: false },
    { seatNumber: 12, label: 'Mat C4', row: 'C (Belakang)', zone: 'BACK', zoneTitle: 'Beginner-Friendly Zone', isBooked: true },
  ]);

  const [selectedSpot, setSelectedSpot] = useState<StudioSpot | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectSpot = (spot: StudioSpot) => {
    if (spot.isBooked) return;
    setSelectedSpot(spot);
  };

  const handleConfirm = () => {
    if (!selectedSpot) return;
    soundFx.playAccessGrantedSound();
    setIsSuccess(true);
    onConfirmSpot(selectedSpot);

    // Mark as booked
    setSpots((prev) =>
      prev.map((s) => (s.seatNumber === selectedSpot.seatNumber ? { ...s, isBooked: true } : s))
    );
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`KINETIC Studio: ${classNameTitle} (${selectedSpot?.label || 'Spot Booking'})`);
    const details = encodeURIComponent(`Sesi kelas ${classNameTitle} bersama ${instructor} di ${roomName}. Spot Anda: ${selectedSpot?.label} (${selectedSpot?.zoneTitle}). Tunjukkan Dynamic QR Pass di gerbang turnstile.`);
    const location = encodeURIComponent(`KINETIC Tech Gym — ${roomName}`);
    
    // Create tomorrow's date at 18:30 for template
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 8);
    const startIso = `${dateStr}T113000Z`;
    const endIso = `${dateStr}T123000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // Download .ics file helper
  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KINETIC Gym Platform//Class Booking//ID
BEGIN:VEVENT
SUMMARY:KINETIC: ${classNameTitle} (${selectedSpot?.label})
DESCRIPTION:Instruktur: ${instructor} | Lokasi: ${roomName} | Spot: ${selectedSpot?.label}
LOCATION:KINETIC Gym, ${roomName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KINETIC_${classNameTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-volt to-transparent"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider mb-1">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Studio Spot Picker (Cinema-Style)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-textPrimary">
              {classNameTitle}
            </h3>
            <p className="text-xs text-textMuted mt-0.5 font-mono">
              {roomName} • {instructor} • {timeString}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-xl bg-elevated hover:bg-surface border border-border text-textMuted hover:text-textPrimary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE WITH ADD TO CALENDAR ACTIONS */
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-volt/20 text-volt border border-volt/40 flex items-center justify-center mx-auto glow-volt shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-display font-extrabold text-textPrimary">
                Spot {selectedSpot?.label} Berhasil Dikunci! 🎉
              </h4>
              <p className="text-xs font-mono text-cyan">
                {selectedSpot?.zoneTitle} • Kursi terdaftar di sistem turnstile
              </p>
              <p className="text-xs text-textMuted max-w-sm mx-auto leading-relaxed">
                Tiket kelas otomatis disinkronkan ke Dynamic QR Pass Anda. Datang 5 menit sebelum kelas dimulai.
              </p>
            </div>

            {/* Smart Utility: Calendar Actions */}
            <div className="p-4 rounded-2xl bg-elevated/70 border border-border space-y-3 max-w-md mx-auto">
              <div className="text-[11px] font-mono text-volt uppercase tracking-wider font-bold flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Pasang Pengingat Jadwal (Reminder)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-surface hover:bg-background border border-border text-xs font-mono text-textPrimary hover:text-cyan flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="px-3.5 py-2.5 rounded-xl bg-surface hover:bg-background border border-border text-xs font-mono text-textPrimary hover:text-volt flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Simpan iCal (.ics)</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link
                href="/portal"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-volt text-black font-display font-extrabold text-xs glow-volt hover:bg-[#b8ea29] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <span>Buka Member Pass</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-textMuted hover:text-textPrimary transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        ) : (
          /* SEAT MATRIX WITH ZONE BREAKDOWNS */
          <div className="space-y-6 pt-5">
            {/* Instructor Stage / Podium */}
            <div className="w-full py-2.5 rounded-xl bg-elevated/80 border border-border text-center text-xs font-mono text-cyan tracking-widest uppercase flex items-center justify-center gap-2">
              <Radio className="w-3.5 h-3.5 text-volt" />
              <span>PANGGUNG INSTRUKTUR / DEPAN CERMIN</span>
              <Radio className="w-3.5 h-3.5 text-volt" />
            </div>

            {/* Matrix 3 Rows x 4 Cols with Zone Labels */}
            <div className="space-y-4">
              {/* Row A: Front Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-volt uppercase">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-volt" /> ROW A (Front Row · High Energy)</span>
                  <span className="opacity-70">Dekat Instruktur</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {spots.slice(0, 4).map((spot) => renderSpotButton(spot))}
                </div>
              </div>

              {/* Row B: Middle Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan uppercase">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan" /> ROW B (Middle Row · Balanced View)</span>
                  <span className="opacity-70">Visibilitas Maksimal</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {spots.slice(4, 8).map((spot) => renderSpotButton(spot))}
                </div>
              </div>

              {/* Row C: Back Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-textMuted uppercase">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" /> ROW C (Back Row · Beginner-Friendly)</span>
                  <span className="opacity-70">Ruang Nyaman</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {spots.slice(8, 12).map((spot) => renderSpotButton(spot))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs font-mono text-textMuted pt-2 border-t border-border/60">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-elevated border border-border"></span>
                  <span>Tersedia</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-volt"></span>
                  <span className="text-volt font-bold">Pilihanmu</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-elevated opacity-40"></span>
                  <span>Terisi</span>
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border/60">
              <div>
                <div className="text-[10px] font-mono text-textMuted uppercase tracking-wider">SPOT TERPILIH:</div>
                <div className="text-base font-display font-extrabold text-volt">
                  {selectedSpot ? `${selectedSpot.label} — ${selectedSpot.zoneTitle}` : 'Pilih salah satu matras'}
                </div>
              </div>

              <button
                disabled={!selectedSpot}
                onClick={handleConfirm}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-display font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider ${
                  selectedSpot
                    ? 'bg-volt text-black glow-volt hover:bg-[#b8ea29] cursor-pointer'
                    : 'bg-elevated border border-border text-textMuted opacity-50 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Booking Spot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderSpotButton(spot: StudioSpot) {
    const isSelected = selectedSpot?.seatNumber === spot.seatNumber;
    return (
      <button
        key={spot.seatNumber}
        disabled={spot.isBooked}
        onClick={() => handleSelectSpot(spot)}
        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
          spot.isBooked
            ? 'bg-elevated/30 border-border/40 text-textMuted opacity-40 cursor-not-allowed'
            : isSelected
            ? 'bg-volt text-black border-volt font-bold glow-volt scale-105 cursor-pointer shadow-md'
            : 'bg-elevated/70 border-border text-textPrimary hover:border-volt/60 hover:scale-102 cursor-pointer'
        }`}
      >
        <span className="text-xs font-mono font-bold">{spot.label}</span>
        <span className={`text-[9px] font-mono ${isSelected ? 'text-black' : 'text-textMuted'}`}>
          {spot.isBooked ? 'Terisi' : isSelected ? 'Dipilih' : 'Pilih'}
        </span>
      </button>
    );
  }
}
