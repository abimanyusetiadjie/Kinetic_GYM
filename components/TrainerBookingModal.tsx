'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Calendar,
  Clock,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Star,
  MessageCircle
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';
import { waService } from '@/lib/whatsapp-service';

interface TrainerData {
  id: string;
  name: string;
  title: string;
  homeClub: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

interface TrainerBookingModalProps {
  trainer: TrainerData | null;
  onClose: () => void;
}

export default function TrainerBookingModal({ trainer, onClose }: TrainerBookingModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number>(8); // 8 sessions default
  const [selectedSlot, setSelectedSlot] = useState('18:30 WIB (Besok)');
  const [selectedGoal, setSelectedGoal] = useState('Fat Loss & Body Recomposition');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!trainer) return null;

  const packageOptions = [
    { sessions: 4, discountPct: 0, priceTotal: trainer.hourlyRate * 4, popular: false },
    { sessions: 8, discountPct: 10, priceTotal: Math.round(trainer.hourlyRate * 8 * 0.9), popular: true },
    { sessions: 16, discountPct: 18, priceTotal: Math.round(trainer.hourlyRate * 16 * 0.82), popular: false },
    { sessions: 24, discountPct: 25, priceTotal: Math.round(trainer.hourlyRate * 24 * 0.75), popular: false },
  ];

  const currentPkg = packageOptions.find((p) => p.sessions === selectedPackage) || packageOptions[1];

  const timeSlots = [
    '07:00 WIB (Pagi)',
    '09:30 WIB (Pagi)',
    '14:00 WIB (Siang - Jam Lengang)',
    '17:00 WIB (Sore)',
    '18:30 WIB (Malam - Populer)',
    '20:00 WIB (Malam)',
  ];

  const fitnessGoals = [
    'Fat Loss & Body Recomposition',
    'Hypertrophy (Massa Otot & Bulking)',
    'Strength & Athletic Conditioning',
    'Perbaikan Postur & Mobilitas Sendi',
  ];

  const handleConfirmBooking = () => {
    soundFx.playCashRegisterSound();
    setIsSuccess(true);

    // Send simulated WhatsApp notification to member and trainer
    waService.sendInvoiceNotification(
      'Budi Pratama',
      '081234567890',
      'PT-' + Date.now().toString().slice(-6),
      currentPkg.priceTotal,
      `Paket PT ${selectedPackage} Sesi bersama ${trainer.name}`
    );
  };

  const waConsultUrl = `https://wa.me/628119281001?text=${encodeURIComponent(
    `Halo KINETIC, saya ingin tanya detail program latihan privat bersama Coach ${trainer.name} (${trainer.homeClub}) sebelum mengambil paket.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-volt to-transparent"></div>

        {/* Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-border">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-border relative shrink-0">
            <Image
              src={trainer.imageUrl || 'https://i.pravatar.cc/300'}
              alt={trainer.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider mb-1">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Private Trainer Consultation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-textPrimary">
                Sesi dengan {trainer.name}
              </h3>
              <p className="text-xs text-textMuted mt-0.5 font-mono">
                {trainer.title} • {trainer.homeClub} • {trainer.rating} ★ ({trainer.reviewCount} Sesi)
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
        </div>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-volt/20 text-volt border border-volt/40 flex items-center justify-center mx-auto glow-volt">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-display font-extrabold text-textPrimary">
                Sesi PT Berhasil Dipesan! 🎉
              </h4>
              <p className="text-xs font-mono text-cyan">
                Paket {selectedPackage} Sesi bersama Coach {trainer.name}
              </p>
              <p className="text-xs text-textMuted max-w-sm mx-auto leading-relaxed">
                Jadwal sesi perdana: <strong className="text-volt">{selectedSlot}</strong> di {trainer.homeClub}. Trainer akan menghubungi WhatsApp Anda untuk evaluasi nutrisi.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs glow-volt uppercase tracking-wider cursor-pointer hover:bg-[#b8ea29] transition-colors"
              >
                Selesai & Buka Portal
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING WIZARD FORM */
          <div className="space-y-6 pt-5">
            {/* 1. Select Package */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-textMuted uppercase tracking-wider">
                <span>1. Pilih Paket Sesi Latihan:</span>
                <span className="text-volt font-bold">Hemat s/d 25%</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {packageOptions.map((pkg) => (
                  <button
                    key={pkg.sessions}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.sessions)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                      selectedPackage === pkg.sessions
                        ? 'bg-volt/10 border-volt text-volt glow-volt'
                        : 'bg-elevated/70 border-border text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 right-2 bg-volt text-black text-[9px] font-bold px-1.5 py-0.2 rounded">
                        FAVORIT
                      </span>
                    )}
                    <span className="text-xs font-bold text-textPrimary">{pkg.sessions} Sesi</span>
                    <span className="text-sm font-mono font-extrabold text-volt mt-2">
                      Rp {pkg.priceTotal.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-textMuted">
                      ~Rp {Math.round(pkg.priceTotal / pkg.sessions).toLocaleString('id-ID')}/sesi
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select First Slot */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-textMuted uppercase tracking-wider">
                2. Pilih Jam Sesi Perdana (H+1):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl border text-xs font-mono transition-all text-center cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-cyan/15 border-cyan text-cyan font-bold glow-cyan'
                        : 'bg-elevated/60 border-border text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Fitness Goal Questionnaire */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-textMuted uppercase tracking-wider">
                3. Target Kebugaran Utama Anda:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fitnessGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setSelectedGoal(goal)}
                    className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
                      selectedGoal === goal
                        ? 'bg-volt/10 border-volt text-volt font-bold'
                        : 'bg-elevated/60 border-border text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    ✓ {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Zero-Harassment & Guarantee Badge */}
            <div className="p-3.5 rounded-2xl bg-volt/5 border border-volt/20 flex items-center gap-2.5 text-xs text-textMuted font-mono">
              <ShieldCheck className="w-5 h-5 text-volt shrink-0" />
              <span>
                <strong>Jaminan 100% Zero-Harassment:</strong> Jika Anda merasa tidak cocok setelah sesi pertama, 100% sisa saldo sesi dapat di-refund atau dialihkan ke pelatih lain.
              </span>
            </div>

            {/* Total & Submit Button */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono text-textMuted uppercase">TOTAL ({selectedPackage} SESI):</div>
                <div className="text-2xl font-display font-extrabold text-volt">
                  Rp {currentPkg.priceTotal.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-textPrimary hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat Coach</span>
                </a>

                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs hover:bg-[#b8ea29] transition-all glow-volt flex items-center justify-center gap-2 shadow-lg cursor-pointer uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4 fill-black text-volt" />
                  <span>Ambil Paket PT</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
