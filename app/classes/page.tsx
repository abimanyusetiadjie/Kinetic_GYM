'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import StudioSpotPickerModal, { type StudioSpot } from '@/components/StudioSpotPickerModal';
import { CLASS_SCHEDULES_DATA, type ClassScheduleItem } from '@/lib/mock-data';
import { ScrollReveal, AnimatedNumber } from '@/components/Motion';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClassesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedClassForSpot, setSelectedClassForSpot] = useState<ClassScheduleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['ALL', 'Cardio', 'Strength', 'Dance', 'Yoga', 'Cycling', 'Boxing'];

  const [daysOfWeek, setDaysOfWeek] = useState<{label: string, date: string, count: number}[]>([]);

  React.useEffect(() => {
    const counts = [12, 14, 11, 13, 15, 18, 16];
    const generatedDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
      const dayNum = d.getDate();
      const monthName = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d);
      
      let label = dayName;
      if (i === 0) label = t.classes.today;
      else if (i === 1) label = t.classes.tomorrow;

      return {
        label,
        date: `${dayName}, ${dayNum} ${monthName}`,
        count: counts[i],
      };
    });
    setDaysOfWeek(generatedDays);
  }, [t.classes.today, t.classes.tomorrow]);

  // Map category to photo thumbnail
  const getClassThumbnail = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'cycling':
        return '/images/class-cycling.jpg';
      case 'strength':
        return '/images/class-bodypump.jpg';
      case 'yoga':
        return '/images/class-yoga.jpg';
      case 'boxing':
        return '/images/class-boxing.jpg';
      default:
        return '/images/hero-gym.jpg';
    }
  };

  const filteredClasses = useMemo(() => {
    return CLASS_SCHEDULES_DATA.filter((item) => {
      if (selectedCategory === 'ALL') return true;
      return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [selectedCategory]);

  const handleSpotBooked = (seat: StudioSpot) => {
    setToastMessage(t.classes.toastSuccess.replace('{spot}', seat.label).replace('{class}', selectedClassForSpot?.name || ''));
    setTimeout(() => setToastMessage(null), 4000);
    setSelectedClassForSpot(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      {/* Header */}
      <ScrollReveal className="space-y-4 mb-12 border-b border-border/40 pb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>{t.classes.badge}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-textPrimary uppercase tracking-tighter leading-none">
          {t.classes.title}
        </h1>
        <p className="text-sm sm:text-base text-textMuted max-w-2xl mt-4">
          {t.classes.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Sticky Sidebar */}
        <div className="lg:col-span-3 space-y-10">
          <div className="sticky top-28 space-y-10">
            {/* 7-Day Vertical Date Selector */}
            <ScrollReveal delay={0.1} className="space-y-4">
              <h3 className="text-xs font-mono text-textMuted uppercase tracking-widest border-l-2 border-volt pl-3 mb-2 lg:mb-0">Date</h3>
              <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none snap-x">
                {daysOfWeek.map((day, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`shrink-0 snap-start relative px-4 py-3 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer overflow-hidden min-w-[140px] lg:min-w-0 ${
                        isSelected
                          ? 'border-transparent text-black font-bold scale-[1.02]'
                          : 'bg-surface border border-border text-textMuted hover:text-textPrimary hover:bg-elevated'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="day-pill-vert"
                          className="absolute inset-0 bg-volt glow-volt z-0"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10 flex flex-col">
                        <span className={`text-[10px] font-mono uppercase transition-colors ${isSelected ? 'text-black/60 font-extrabold' : 'text-textMuted'}`}>
                          {day.label}
                        </span>
                        <span className={`text-sm font-display font-bold mt-0.5 transition-colors ${isSelected ? 'text-black' : ''}`}>{day.date}</span>
                      </div>
                      <span className={`hidden lg:block relative z-10 text-[10px] font-mono transition-colors ${isSelected ? 'text-black/80' : 'text-cyan'}`}>
                        {day.count} {t.classes.classCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Category Filter Vertical */}
            <ScrollReveal delay={0.2} className="space-y-4">
              <h3 className="text-xs font-mono text-textMuted uppercase tracking-widest border-l-2 border-cyan pl-3 mb-2 lg:mb-0">Category</h3>
              <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none snap-x">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 snap-start relative px-5 py-3 rounded-xl text-xs font-mono text-center lg:text-left transition-colors cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'text-black font-bold scale-[1.02]'
                          : 'bg-surface border border-border text-textMuted hover:text-textPrimary hover:bg-elevated'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="cat-pill-vert"
                          className="absolute inset-0 bg-cyan glow-cyan z-0"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat === 'ALL' ? t.classes.allCategories : cat}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Class Grid */}
        <div className="lg:col-span-9">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClasses.map((item, idx) => {
                const isFull = item.bookedCount >= item.maxCapacity;
                const thumbnail = getClassThumbnail(item.category);
                
                // Make every 5th item large (span 2 columns) to break symmetry
                const isFeatured = idx % 5 === 0;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.25 }}
                    key={item.id}
                    onClick={() => setSelectedClassForSpot(item)}
                    className={`relative group rounded-3xl overflow-hidden border border-border/50 bg-surface cursor-pointer aspect-[4/5] ${isFeatured ? 'md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-[3/2]' : ''}`}
                  >
                    {/* Background Image */}
                    <Image
                      src={thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-80 sepia-[0.3] grayscale-[0.2]"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    {/* Content Container */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      
                      {/* Top Section */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-volt uppercase tracking-widest w-fit shadow-lg shadow-black/50">
                            {item.time} {t.classes.wib}
                          </span>
                          <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-cyan uppercase tracking-widest w-fit shadow-lg shadow-black/50">
                            {item.category} • {item.durationMins}m
                          </span>
                        </div>
                        {item.intensity === 'Advanced' && (
                          <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-500 backdrop-blur-md shadow-lg shadow-rose-500/20">
                            <Flame className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Bottom Section (Name & Hidden Hover Details) */}
                      <div className={`space-y-4 transition-transform duration-500 ease-out flex flex-col justify-end h-full ${isFeatured ? 'lg:translate-y-12 lg:group-hover:translate-y-0' : 'lg:translate-y-14 lg:group-hover:translate-y-0'}`}>
                        <div>
                          <h3 className={`font-display font-black text-white uppercase leading-[0.9] tracking-tight ${isFeatured ? 'text-4xl md:text-5xl lg:text-6xl max-w-sm' : 'text-3xl'}`}>
                            {item.name}
                          </h3>
                          <p className="text-xs font-mono text-textMuted mt-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-75">
                            with <span className="text-white">{item.instructor.name}</span> • {item.studioName}
                          </p>
                        </div>

                        {/* Hidden Capacity & Button */}
                        <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-150 flex items-center justify-between gap-4 pt-4 border-t border-white/10 mt-auto">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-textMuted">Seats</span>
                              <span className={isFull ? 'text-rose-400' : 'text-volt'}>
                                {item.bookedCount}/{item.maxCapacity}
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div style={{ width: `${(item.bookedCount / item.maxCapacity) * 100}%` }} className={`h-full ${isFull ? 'bg-rose-500' : 'bg-volt'}`}></div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedClassForSpot(item); }}
                            className={`shrink-0 px-5 py-3 rounded-xl font-display font-extrabold text-[11px] uppercase transition-colors shadow-lg ${isFull ? 'bg-white/10 text-white' : 'bg-volt text-black hover:bg-white glow-volt'}`}
                          >
                            {isFull ? 'Waitlist' : 'Book'}
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Spot Picker Modal Popup (USP 2) */}
      {selectedClassForSpot && (
        <StudioSpotPickerModal
          isOpen={!!selectedClassForSpot}
          onClose={() => setSelectedClassForSpot(null)}
          classNameTitle={selectedClassForSpot.name}
          instructor={selectedClassForSpot.instructor.name}
          roomName={selectedClassForSpot.studioName}
          timeString={`${selectedClassForSpot.time} ${t.classes.wib} (${selectedClassForSpot.durationMins} ${t.classes.minutes})`}
          onConfirmSpot={handleSpotBooked}
        />
      )}
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-5 py-3.5 bg-volt text-black font-mono font-bold text-xs rounded-2xl shadow-xl flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">✓</span>
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
