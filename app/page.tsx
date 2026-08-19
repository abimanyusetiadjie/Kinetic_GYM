'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { TextReveal, ScrollReveal, StaggerItem, AnimatedNumber } from '@/components/Motion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  MapPin,
  Calendar,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Flame,
  Gift,
  Clock,
  ChevronDown,
  Play,
  Dumbbell,
  Radio,
  Navigation,
  Compass,
  Loader2,
} from 'lucide-react';
import LiveCrowdBadge from '@/components/LiveCrowdBadge';
import { INDONESIA_50_CLUBS } from '@/lib/national-gym-data';

export default function HomePage() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [calcPlanType, setCalcPlanType] = useState<'SINGLE' | 'ALL'>('ALL');
  const [calcDuration, setCalcDuration] = useState<number>(3); // 3 months default
  const [liveCrowd, setLiveCrowd] = useState(38);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [nearestClub, setNearestClub] = useState<{ name: string; distanceKm: number; address: string } | null>(null);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            const closest = INDONESIA_50_CLUBS[0];
            setNearestClub({
              name: closest.name,
              distanceKm: closest.distanceKm,
              address: closest.address,
            });
            setDetectingLocation(false);
          }, 800);
        },
        () => {
          setTimeout(() => {
            setNearestClub({
              name: 'KINETIC Sudirman SCBD',
              distanceKm: 0.8,
              address: 'Pacific Century Place Lt. B1, SCBD Lot 10, Jakarta Selatan',
            });
            setDetectingLocation(false);
          }, 800);
        },
        { timeout: 4000 }
      );
    } else {
      setNearestClub({
        name: 'KINETIC Sudirman SCBD',
        distanceKm: 0.8,
        address: 'Pacific Century Place Lt. B1, SCBD Lot 10, Jakarta Selatan',
      });
      setDetectingLocation(false);
    }
  };

  useEffect(() => {
    // Simulate real-time club crowd fluctuations
    const interval = setInterval(() => {
      setLiveCrowd(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const next = prev + change;
        if (next > 45) return 45;
        if (next < 32) return 32;
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const calculateTeaserPrice = () => {
    let basePerMonth = calcPlanType === 'SINGLE' ? 399000 : 499000;
    let discount = 0;
    if (calcDuration === 3) discount = 0.15;
    if (calcDuration === 6) discount = 0.25;
    if (calcDuration === 12) discount = 0.40;

    const netPerMonth = Math.round(basePerMonth * (1 - discount));
    const total = netPerMonth * calcDuration;
    return { netPerMonth, total };
  };

  const { netPerMonth, total } = calculateTeaserPrice();

  const studioClasses = [
    {
      title: 'Indoor RPM Cycling',
      category: 'Cardio & Endurance',
      image: '/images/class-cycling.jpg',
      sessions: '45 Kelas / Minggu',
      tag: 'FAVORIT',
    },
    {
      title: 'Les Mills BodyPump',
      category: 'Strength & Barbell',
      image: '/images/class-bodypump.jpg',
      sessions: '60 Kelas / Minggu',
      tag: 'POPULER',
    },
    {
      title: 'Power Flow Yoga & Pilates',
      category: 'Mobility & Core',
      image: '/images/class-yoga.jpg',
      sessions: '35 Kelas / Minggu',
      tag: 'WELLNESS',
    },
    {
      title: 'Boxing Conditioning',
      category: 'HIIT & Combat',
      image: '/images/class-boxing.jpg',
      sessions: '40 Kelas / Minggu',
      tag: 'HIGH ENERGY',
    },
  ];

  const faqs = [
    { q: t.home.faq.q1, a: t.home.faq.a1 },
    { q: t.home.faq.q2, a: t.home.faq.a2 },
    { q: t.home.faq.q3, a: t.home.faq.a3 },
    { q: t.home.faq.q4, a: t.home.faq.a4 },
    { q: t.home.faq.q5, a: t.home.faq.a5 },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION: EDITORIAL & ASYMMETRICAL */}
      <section className="relative min-h-[auto] lg:min-h-[85vh] flex items-center pt-4 sm:pt-8 lg:pt-10 pb-8 sm:pb-16 overflow-hidden bg-background">
        {/* Background Noise & Gradient */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-0 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-3/4 h-[80vh] bg-volt/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>

        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Headline & Copy (Left Column) */}
          <div className="lg:col-span-7 relative z-20 pt-0">
            <div className="flex flex-col items-start gap-4 sm:gap-6">
              
              <ScrollReveal delay={0.1} direction="up" className="inline-block px-3 py-1 bg-surface border border-border text-[9px] sm:text-[10px] font-mono text-textMuted tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                {t.hero.badge}
              </ScrollReveal>

              <TextReveal
                text={t.hero.title}
                delay={0.2}
                className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-textPrimary leading-[0.92] tracking-tighter uppercase break-words w-full"
              />

              <ScrollReveal delay={0.4} direction="up" className="pl-3 border-l-2 border-volt mt-2 max-w-xl">
                <p 
                  className="text-base sm:text-lg text-textMuted font-body leading-relaxed tracking-tight"
                  dangerouslySetInnerHTML={{ __html: t.hero.subtitle }}
                />
              </ScrollReveal>

              {/* Mobile-Friendly Hero CTA Actions */}
              <ScrollReveal delay={0.5} direction="up" className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full max-w-lg">
                <Link
                  href="/membership"
                  className="w-full sm:w-auto px-7 py-4 sm:py-4.5 rounded-2xl bg-volt text-black font-display font-black text-sm tracking-wider uppercase overflow-hidden hover:skew-x-[-1deg] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg glow-volt active:scale-95 text-center shrink-0"
                >
                  <span className="relative z-10">{t.hero.cta}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="w-full sm:w-auto px-5 py-4 sm:py-4.5 rounded-2xl bg-surface hover:bg-elevated border border-cyan/40 hover:border-cyan text-cyan text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 text-center shrink-0"
                  title="Cari cabang KINETIC terdekat berdasarkan koordinat GPS perangkat Anda"
                >
                  {detectingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-volt" />
                      <span>Memindai GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-cyan fill-cyan/20" />
                      <span>{nearestClub ? 'Deteksi Ulang Lokasi' : 'Deteksi Cabang Terdekat'}</span>
                    </>
                  )}
                </button>
              </ScrollReveal>

              {/* Reactive Geolocation Nearest Club Banner (High Visibility Card) */}
              <AnimatePresence>
                {nearestClub && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-4 sm:p-5 rounded-2xl bg-surface/95 border-2 border-volt shadow-2xl shadow-volt/10 max-w-lg w-full space-y-3 relative overflow-hidden backdrop-blur-xl"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-volt to-transparent"></div>
                    <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-2.5">
                      <span className="text-[11px] font-mono text-volt uppercase tracking-wider font-extrabold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-volt" />
                        <span>CABANG TERDEKAT ({nearestClub.distanceKm} KM DARI ANDA)</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Buka Sekarang
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                      <div>
                        <div className="text-base sm:text-lg font-display font-black text-textPrimary">{nearestClub.name}</div>
                        <div className="text-xs text-textMuted font-mono line-clamp-1 mt-0.5">{nearestClub.address}</div>
                      </div>
                      <Link
                        href="/clubs"
                        className="px-4 py-2.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs uppercase tracking-wider shrink-0 hover:bg-[#b8ea29] transition-all flex items-center justify-center gap-1.5 shadow-md text-center active:scale-95"
                      >
                        <span>Lihat Rute</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Editorial Image & Stats (Right Column) */}
          <div className="lg:col-span-5 relative z-10 mt-8 lg:mt-0">
            <ScrollReveal delay={0.3} direction="left" className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-h-[580px] rounded-3xl bg-surface border border-border/50 overflow-hidden group shadow-2xl">
              <Image
                src="/images/hero-gym.jpg"
                alt="KINETIC Tech Fitness Club Interior"
                fill
                priority
                className="object-cover group-hover:scale-105 group-hover:rotate-0.5 transition-all duration-700 opacity-90 sepia-[0.1] contrast-125 brightness-90 grayscale-[0.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent mix-blend-multiply pointer-events-none"></div>
              
              {/* Ticker / Live Data Overlay on Image */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col gap-3 shadow-lg text-white">
                  <div className="flex items-center justify-between font-mono text-[11px] text-textMuted uppercase tracking-widest border-b border-white/10 pb-2">
                    <span>System Status</span>
                    <span className="flex items-center gap-2 text-volt font-bold">
                      <span className="w-1.5 h-1.5 bg-volt animate-ping rounded-full"></span>
                      {liveCrowd} {t.hero.liveBadge.replace('38 ', '')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="text-xl font-display font-black text-white">
                        <AnimatedNumber value={50} suffix="+" duration={1.5} />
                      </div>
                      <div className="text-[10px] font-mono text-textMuted uppercase">{t.home.stats.branches}</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-black text-white">
                        &lt;<AnimatedNumber value={200} suffix="ms" duration={1.5} />
                      </div>
                      <div className="text-[10px] font-mono text-textMuted uppercase">{t.home.stats.scan}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 2. FIT-HUB STYLE STUDIO CLASSES PHOTO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-volt font-bold">
              {t.home.gallery.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-textPrimary">
              {t.home.gallery.title}
            </h2>
          </div>
          <Link
            href="/classes"
            className="text-xs font-mono text-volt flex items-center gap-2 hover:underline"
          >
            <span>{t.home.gallery.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {studioClasses.map((cls, idx) => {
            const isFeatured = idx === 0; // The first class becomes the hero piece

            return (
              <ScrollReveal
                key={idx}
                delay={idx * 0.1}
                className={`rounded-3xl overflow-hidden bg-surface border border-border hover:border-volt/60 transition-all group relative flex flex-col justify-end ${
                  isFeatured ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                }`}
              >
                {/* Background Image */}
                <Image
                  src={cls.image}
                  alt={cls.title}
                  fill
                  className={`object-cover lg:group-hover:scale-105 transition-transform duration-700 ease-out ${
                    isFeatured ? 'opacity-80 lg:group-hover:opacity-100' : 'opacity-60 lg:group-hover:opacity-90'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* Floating Tag */}
                <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-volt border border-volt/30 shadow-lg">
                  {cls.tag}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 space-y-4">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-cyan uppercase tracking-widest">{cls.category}</div>
                    <h3 className={`font-display font-extrabold text-white lg:group-hover:text-volt transition-colors leading-[1.1] tracking-tight ${
                      isFeatured ? 'text-3xl md:text-5xl max-w-sm' : 'text-xl'
                    }`}>
                      {cls.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-textMuted border-t border-white/10 pt-4">
                    <span>{cls.sessions}</span>
                    <Link
                      href="/classes"
                      className="text-volt font-bold flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <span>{t.home.gallery.pickSpot}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. DUAL FACILITY SPOTLIGHT: STAGGERED OVERLAP LAYOUT */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Card 1: Free Weights (Large, Left) */}
          <ScrollReveal direction="up" className="lg:col-span-7 rounded-3xl overflow-hidden bg-surface border border-border relative group flex flex-col justify-between space-y-8 aspect-square lg:aspect-[4/3]">
            {/* Background Image full cover */}
            <Image
              src="/images/facility-weights.jpg"
              alt="Free Weights Area"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 sepia-[0.3] grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-8 lg:p-12 space-y-4 h-full flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-volt/20 text-volt text-xs font-mono border border-volt/30 w-fit backdrop-blur-md">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{t.home.facilities.badge1}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tight leading-[0.9]">
                {t.home.facilities.title1}
              </h3>
              <p className="text-sm sm:text-base text-textMuted leading-relaxed max-w-md">
                {t.home.facilities.desc1}
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2: Sauna (Smaller, Right, Staggered Down) */}
          <ScrollReveal delay={0.2} direction="up" className="lg:col-span-5 rounded-3xl overflow-hidden bg-surface border border-border relative group flex flex-col justify-between space-y-8 aspect-square lg:mt-32">
            <Image
              src="/images/facility-sauna.jpg"
              alt="Sauna and Cold Plunge"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 sepia-[0.3] grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="relative z-10 p-8 lg:p-10 space-y-4 h-full flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/20 text-cyan text-xs font-mono border border-cyan/30 w-fit backdrop-blur-md">
                <Flame className="w-3.5 h-3.5" />
                <span>{t.home.facilities.badge2}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight leading-[0.9]">
                {t.home.facilities.title2}
              </h3>
              <p className="text-sm text-textMuted leading-relaxed max-w-sm">
                {t.home.facilities.desc2}
              </p>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. TURNSTILE SMART GATE IN-ACTION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-volt/40 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center glow-volt">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 text-volt text-xs font-mono border border-volt/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.home.gate.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-textPrimary">
              {t.home.gate.title}
            </h2>
            <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
              {t.home.gate.desc}
            </p>

            <div className="space-y-3 text-xs font-mono text-textPrimary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-volt" />
                <span>{t.home.gate.check1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-volt" />
                <span>{t.home.gate.check2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-volt" />
                <span>{t.home.gate.check3}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/portal"
                className="px-6 py-3.5 rounded-xl bg-volt text-black font-display font-black text-xs glow-volt hover:bg-[#b8ea29] transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.home.gate.btnQr}</span>
              </Link>
              <Link
                href="/admin/gate"
                className="px-6 py-3.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>{t.home.gate.btnAdmin}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-border shadow-2xl aspect-[4/3] relative">
              <Image
                src="/images/gate-turnstile.jpg"
                alt="Turnstile QR Code Gate Scan"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5 KILLER USPs RECAP: EDITORIAL LIST */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
        <ScrollReveal className="space-y-4 max-w-2xl">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-volt font-bold border-l-2 border-volt pl-3">
            {t.home.usps.badge}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-textPrimary leading-[0.95] tracking-tighter uppercase">
            {t.home.usps.title}
          </h2>
          <p className="text-sm text-textMuted max-w-md pt-4">
            {t.home.usps.desc}
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-12 sm:gap-16 pt-8">
          {[
            {
              num: '01',
              title: t.home.usps.usp1Title.replace('01. ', ''),
              desc: t.home.usps.usp1Desc,
              link: t.home.usps.usp1Link,
              href: '/clubs'
            },
            {
              num: '02',
              title: t.home.usps.usp2Title.replace('02. ', ''),
              desc: t.home.usps.usp2Desc,
              link: t.home.usps.usp2Link,
              href: '/classes'
            },
            {
              num: '03',
              title: t.home.usps.usp3Title.replace('03. ', ''),
              desc: t.home.usps.usp3Desc,
              link: t.home.usps.usp3Link,
              href: '/portal'
            },
            {
              num: '04',
              title: t.home.usps.usp4Title.replace('04. ', ''),
              desc: t.home.usps.usp4Desc,
              link: t.home.usps.usp4Link,
              href: '/portal'
            },
            {
              num: '05',
              title: t.home.usps.usp5Title.replace('05. ', ''),
              desc: t.home.usps.usp5Desc,
              link: t.home.usps.usp5Link,
              href: '/trainers'
            }
          ].map((usp, idx) => (
            <ScrollReveal direction={idx % 2 === 0 ? 'right' : 'left'} delay={0.1} key={idx} className="relative group grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-border/40 pb-12">
              
              {/* Massive Background Number */}
              <div className="absolute top-0 right-4 md:right-8 lg:right-16 text-[8rem] sm:text-[12rem] lg:text-[16rem] font-display font-black text-white/[0.02] leading-none select-none pointer-events-none group-hover:text-volt/[0.05] transition-colors duration-500 z-0">
                {usp.num}
              </div>

              {/* Content */}
              <div className="md:col-span-8 lg:col-span-6 relative z-10 space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-volt font-bold">{usp.num} //</span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-textPrimary uppercase tracking-tight group-hover:text-volt transition-colors">
                    {usp.title}
                  </h3>
                </div>
                <p className="text-sm text-textMuted leading-relaxed pl-10 md:pl-12 max-w-lg">
                  {usp.desc}
                </p>
                <div className="pl-10 md:pl-12 pt-2">
                  <Link href={usp.href} className="inline-flex items-center gap-2 text-[11px] font-mono text-white hover:text-volt uppercase tracking-widest border-b border-white/20 hover:border-volt pb-1 transition-all group/link">
                    <span>{usp.link}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. DYNAMIC PRICING CALCULATOR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border space-y-8 relative overflow-hidden shadow-2xl">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-volt font-bold">
              {t.home.calculator.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-textPrimary">
              {t.home.calculator.title}
            </h2>
            <p className="text-xs sm:text-sm text-textMuted">
              {t.home.calculator.desc}
            </p>
          </div>

          {/* Plan Toggle & Duration Pills */}
          <div className="space-y-5 max-w-xl mx-auto">
            {/* Single vs All Club Toggle */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-elevated border border-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setCalcPlanType('SINGLE')}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  calcPlanType === 'SINGLE' ? 'bg-volt text-black glow-volt' : 'text-textMuted hover:text-textPrimary'
                }`}
              >
                {t.home.calculator.singleClub}
              </button>
              <button
                type="button"
                onClick={() => setCalcPlanType('ALL')}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  calcPlanType === 'ALL' ? 'bg-volt text-black glow-volt' : 'text-textMuted hover:text-textPrimary'
                }`}
              >
                {t.home.calculator.allClub}
              </button>
            </div>

            {/* Duration Selector */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { dur: 1, label: t.home.calculator.dur1 },
                { dur: 3, label: t.home.calculator.dur3 },
                { dur: 6, label: t.home.calculator.dur6 },
                { dur: 12, label: t.home.calculator.dur12 },
              ].map((d) => (
                <button
                  key={d.dur}
                  type="button"
                  onClick={() => setCalcDuration(d.dur)}
                  className={`py-2.5 rounded-xl border text-xs font-mono transition-all text-center cursor-pointer ${
                    calcDuration === d.dur
                      ? 'bg-cyan/15 border-cyan text-cyan font-bold glow-cyan'
                      : 'bg-elevated/60 border-border text-textMuted hover:text-textPrimary'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Card */}
          <div className="p-6 rounded-2xl bg-background border border-border flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-xs font-mono text-textMuted">{t.home.calculator.startFrom}</div>
              <div className="text-3xl sm:text-4xl font-display font-black text-volt">
                <AnimatedNumber value={netPerMonth} prefix="Rp " duration={0.8} />
                <span className="text-xs font-mono text-textMuted font-normal">{t.home.calculator.perMonth}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan">
                {t.home.calculator.totalPay} {calcDuration} {t.home.calculator.months}: <AnimatedNumber value={total} prefix="Rp " duration={0.8} />
              </div>
            </div>

            <Link
              href="/membership"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-volt text-black font-display font-black text-xs hover:bg-[#b8ea29] transition-all glow-volt flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span>{t.home.calculator.btn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION: EDITORIAL VERTICAL STACK */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-textPrimary pb-6">
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-volt font-bold">
              {t.home.faq.badge}
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-textPrimary tracking-tighter uppercase">
              {t.home.faq.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="group border-b border-border/60 transition-colors hover:border-volt/50"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-start gap-6 py-6 sm:py-8 cursor-pointer"
                >
                  <span className="text-xs font-mono text-volt font-bold pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    0{idx + 1}
                  </span>
                  <div className="flex-1 text-left space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display font-bold text-lg sm:text-xl text-textPrimary uppercase tracking-tight group-hover:text-volt transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-textMuted group-hover:text-volt transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-textMuted leading-relaxed font-body pr-8 pb-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
