'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Star,
  CheckCircle2,
  ShieldCheck,
  Play,
  ArrowRight,
  Target,
  Flame,
  Zap,
  MessageCircle,
  TrendingUp,
  Dumbbell,
  SlidersHorizontal,
  Users
} from 'lucide-react';
import { TRAINERS_DATA, type TrainerProfile } from '@/lib/mock-data';
import TrainerBookingModal from '@/components/TrainerBookingModal';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/Motion';

// Extend mock data with specific visual attributes & transformation proof for the Fighter Select screen
const FIGHTER_ROSTER = TRAINERS_DATA.map((t, idx) => ({
  ...t,
  category: idx === 0 ? 'HYPERTROPHY' : idx === 1 ? 'FAT_LOSS' : idx === 2 ? 'MOBILITY' : 'COMBAT',
  transformationMetric: idx === 0 
    ? 'Rata-rata Klien: +4.2kg Massa Otot (12 Minggu)'
    : idx === 1 
    ? 'Rata-rata Klien: -8.5kg Lemak Tubuh & Drop 2 Ukuran Celana'
    : idx === 2 
    ? 'Pemulihan Postur 100% & Bebas Nyeri Punggung Bawah'
    : 'Peningkatan VO2Max +45% & Kecepatan Reaksi Pukulan',
  imageUrl: idx % 2 === 0 
    ? 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  themeColor: idx % 3 === 0 ? 'text-volt bg-volt border-volt' : idx % 3 === 1 ? 'text-cyan bg-cyan border-cyan' : 'text-orange bg-orange border-orange',
  themeColorText: idx % 3 === 0 ? 'text-volt' : idx % 3 === 1 ? 'text-cyan' : 'text-orange',
  themeGlow: idx % 3 === 0 ? 'glow-volt shadow-[inset_0_0_100px_rgba(202,255,51,0.2)]' : idx % 3 === 1 ? 'glow-cyan shadow-[inset_0_0_100px_rgba(0,229,255,0.2)]' : 'glow-orange shadow-[inset_0_0_100px_rgba(255,94,30,0.2)]',
}));

export default function TrainersPage() {
  const { t } = useLanguage();
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedGoalFilter, setSelectedGoalFilter] = useState<string>('ALL');

  const goalFilters = [
    { key: 'ALL', label: 'Semua Spesialis' },
    { key: 'HYPERTROPHY', label: 'Bentuk Otot (Hypertrophy)' },
    { key: 'FAT_LOSS', label: 'Fat Loss & Conditioning' },
    { key: 'MOBILITY', label: 'Mobilitas & Postur' },
    { key: 'COMBAT', label: 'Boxing & MMA' },
  ];

  const filteredFighters = useMemo(() => {
    if (selectedGoalFilter === 'ALL') return FIGHTER_ROSTER;
    return FIGHTER_ROSTER.filter((f) => f.category === selectedGoalFilter);
  }, [selectedGoalFilter]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative pb-20">
      {/* Dynamic Background Flare */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 bg-noise opacity-50"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-10">
        
        {/* Header - Editorial Style */}
        <ScrollReveal className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-white uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <Award className="w-3.5 h-3.5 text-volt" />
            <span>KINETIC Elite Roster · Zero-Harassment Guaranteed</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
            Choose Your <br/><span className="text-volt">Champion.</span>
          </h1>
          <p className="text-sm sm:text-base font-mono text-textMuted max-w-xl leading-relaxed">
            Para pelatih KINETIC adalah atlet elit tersertifikasi internasional (NASM / CSCS). Tidak ada bujuk rayu di lantai gym — pilih pelatih sesuai target fisik Anda.
          </p>
        </ScrollReveal>

        {/* Goal / Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {goalFilters.map((filter) => {
            const isSelected = selectedGoalFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setSelectedGoalFilter(filter.key)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-volt text-black font-extrabold glow-volt scale-102' 
                    : 'bg-surface border border-border text-textMuted hover:text-textPrimary hover:bg-elevated'
                }`}
              >
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Fighter Select Grid (Horizontal Expansion Gallery on Desktop / Stacked on Mobile) */}
        <div className="min-h-[580px] flex flex-col md:flex-row gap-4 w-full">
          <AnimatePresence>
            {filteredFighters.map((trainer) => {
              const isHovered = hoveredId === trainer.id;
              const isOtherHovered = hoveredId !== null && hoveredId !== trainer.id;
              const waText = encodeURIComponent(`Halo KINETIC, saya tertarik berkonsultasi mengenai program latihan 1-on-1 bersama Coach ${trainer.name}.`);
              const waLink = `https://wa.me/628119281001?text=${waText}`;
              
              return (
                <motion.div
                  key={trainer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onMouseEnter={() => setHoveredId(trainer.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative rounded-[2rem] overflow-hidden cursor-pointer border border-border bg-surface transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex-shrink-0 flex-grow-0
                    ${isHovered ? 'md:flex-[3_3_0%] shadow-2xl z-20 border-volt/60' : isOtherHovered ? 'md:flex-[0.7_0.7_0%] opacity-50 grayscale-[0.6]' : 'md:flex-1'}
                    w-full md:w-auto h-96 md:h-[580px]
                  `}
                >
                  {/* Background Image full bleed */}
                  <Image
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    fill
                    className={`object-cover object-top transition-transform duration-1000 ease-out ${isHovered ? 'scale-110' : 'scale-100 grayscale-[0.4] sepia-[0.1]'}`}
                  />
                  
                  {/* Dramatic Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 ${isHovered ? trainer.themeGlow : ''}`}></div>

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    
                    {/* Stats & Badge */}
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-black bg-volt px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg shadow-volt/20">
                        <Star className="w-3.5 h-3.5 fill-black" /> {trainer.rating}
                      </div>
                      <div className="text-[10px] font-mono text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        {trainer.reviewsCount} Klien Aktif
                      </div>
                    </div>

                    {/* Transformation Metric Pill */}
                    <div className="mb-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan">
                        <TrendingUp className="w-3 h-3 text-volt" />
                        <span className="truncate max-w-[260px]">{trainer.transformationMetric}</span>
                      </div>
                    </div>

                    {/* Name and Title */}
                    <motion.div layout className="relative z-10 space-y-1 w-full overflow-hidden">
                      <h3 className={`font-display font-black text-white uppercase tracking-tighter whitespace-nowrap transition-all duration-500 origin-left
                        ${isHovered ? 'text-4xl lg:text-6xl ' + trainer.themeColorText : 'text-2xl lg:text-4xl'}
                      `}>
                        {trainer.name.split(' ')[0]}
                        <br className={isHovered ? 'hidden' : 'block'} />
                        <span className={isHovered ? 'text-white' : ''}>{trainer.name.split(' ').slice(1).join(' ')}</span>
                      </h3>
                      
                      <motion.div 
                        layout
                        className={`text-xs font-mono uppercase tracking-widest transition-all duration-500 ${isHovered ? 'text-white opacity-100' : 'text-textMuted opacity-80'}`}
                      >
                        {trainer.title} • {trainer.homeClub}
                      </motion.div>
                    </motion.div>

                    {/* Hidden Details Revealed on Hover (Desktop) */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="space-y-4 overflow-hidden hidden md:block"
                        >
                          {/* Specializations Grid */}
                          <div className="flex gap-2 flex-wrap">
                            {trainer.specializations.map((spec) => (
                              <span key={spec} className="px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white uppercase">
                                {spec}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-3 border-t border-white/20">
                            <div className="flex-1">
                              <div className="text-[10px] font-mono text-white/60 uppercase">Tarif per Sesi</div>
                              <div className={`text-xl font-display font-black ${trainer.themeColorText}`}>
                                Rp {trainer.hourlyRate.toLocaleString('id-ID')}
                              </div>
                            </div>

                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3.5 py-3 rounded-xl bg-surface/80 hover:bg-surface border border-white/30 text-[11px] font-mono text-white flex items-center gap-1.5 transition-colors"
                              title="Konsultasi via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-400" />
                              <span>Chat</span>
                            </a>

                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedTrainer(trainer); }}
                              className={`px-5 py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 text-black transition-all hover:scale-105 ${trainer.themeColor.split(' ')[1]}`}
                            >
                              <span>Book PT</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Mobile Only Action Row */}
                    <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex justify-between items-center gap-2">
                      <div>
                        <div className="text-[9px] font-mono text-textMuted uppercase">Tarif Sesi:</div>
                        <div className={`text-base font-display font-black ${trainer.themeColorText}`}>
                          Rp {trainer.hourlyRate.toLocaleString('id-ID')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-2 rounded-lg bg-surface border border-white/20 text-xs text-white"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </a>
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedTrainer(trainer); }}
                          className={`px-4 py-2 rounded-lg font-display font-bold text-xs uppercase text-black ${trainer.themeColor.split(' ')[1]}`}
                        >
                          Pilih Paket
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Zero-Harassment Policy Banner */}
        <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-volt/10 text-volt border border-volt/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-display font-extrabold text-textPrimary">
                100% Zero-Harassment & Money-Back Guarantee
              </h4>
              <p className="text-xs text-textMuted font-mono mt-0.5">
                Tidak cocok setelah sesi perdana? 100% sisa kuota sesi Anda kami kembalikan tanpa syarat berbelit.
              </p>
            </div>
          </div>
          
          <a
            href="https://wa.me/628119281001?text=Halo%20KINETIC,%20saya%20ingin%20tanya%20rekomendasi%20pelatih%20yang%20sesuai%20dengan%20goal%20saya."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Tanya Rekomendasi PT via WA</span>
          </a>
        </div>

      </div>

      {/* Booking Wizard Modal */}
      {selectedTrainer && (
        <TrainerBookingModal
          trainer={{
            id: selectedTrainer.id,
            name: selectedTrainer.name,
            title: selectedTrainer.title,
            homeClub: selectedTrainer.homeClub,
            hourlyRate: selectedTrainer.hourlyRate,
            rating: selectedTrainer.rating,
            reviewCount: selectedTrainer.reviewsCount,
            imageUrl: selectedTrainer.imageUrl,
          }}
          onClose={() => setSelectedTrainer(null)}
        />
      )}
    </div>
  );
}
