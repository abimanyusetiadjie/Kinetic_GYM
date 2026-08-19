'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  ShieldCheck,
  Flame,
  Gift,
  ArrowRight,
  Tag,
  Zap,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingDown,
  HelpCircle
} from 'lucide-react';
import { getPlanPrices, validatePromoCode } from '@/lib/pricing';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MembershipPage() {
  const { t } = useLanguage();
  const [tier, setTier] = useState<'SINGLE' | 'ALL'>('ALL');
  const [duration, setDuration] = useState<number>(3); // 3 months default
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [selectedPlanForMobile, setSelectedPlanForMobile] = useState<'PRO' | 'STARTER' | 'ELITE'>('PRO');

  // Base pricing
  const baseStarter = tier === 'SINGLE' ? 399000 : 499000;
  const basePro = tier === 'SINGLE' ? 499000 : 649000;
  const baseElite = tier === 'SINGLE' ? 699000 : 899000;

  // Pricing calculations
  const starter = getPlanPrices(tier, duration, appliedDiscount, 399000, 499000);
  const pro = getPlanPrices(tier, duration, appliedDiscount, 499000, 649000);
  const elite = getPlanPrices(tier, duration, appliedDiscount, 699000, 899000);

  // Exact savings in Rupiah
  const starterSavings = (baseStarter * duration) - starter.finalTotal;
  const proSavings = (basePro * duration) - pro.finalTotal;
  const eliteSavings = (baseElite * duration) - elite.finalTotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePromoCode(promoCode);
    setAppliedDiscount(result.discount);
    if (promoCode.trim()) {
      setPromoMessage({ text: result.message, success: result.success });
    }
  };

  const promoQuery = appliedDiscount > 0 ? `&promo=${promoCode.trim().toUpperCase()}` : '';

  // Feature Tooltip Data Dictionary
  const featureExplanations: Record<string, { title: string; desc: string }> = {
    'anti_passback': {
      title: 'Anti-Passback Dynamic QR',
      desc: 'Token QR berputar secara kriptografis setiap 15 detik. Mencegah penyalahgunaan tangkapan layar (screenshot) dan memastikan akses aman 100% tanpa kartu fisik.'
    },
    'freeze_policy': {
      title: 'Bebas Freeze Keanggotaan',
      desc: 'Sedang liburan, dinas luar kota, atau dalam masa pemulihan cedera? Bekukan keanggotaan Anda kapan saja lewat aplikasi tanpa biaya administrasi tambahan.'
    },
    'buddy_pass': {
      title: 'WhatsApp Buddy Pass',
      desc: 'Bagikan tiket tamu digital ke teman atau kerabat langsung via tautan WhatsApp. Teman Anda bisa scan masuk dan berlatih bersama tanpa biaya.'
    },
    'sauna_recovery': {
      title: 'Scandinavian Sauna & Ice Bath',
      desc: 'Akses penuh ke fasilitas ruang sauna kayu aromatik dan bak rendam es bersuhu 4°C untuk mempercepat reduksi asam laktat setelah latihan berat.'
    }
  };

  const getActiveMobilePrice = () => {
    if (selectedPlanForMobile === 'STARTER') return starter;
    if (selectedPlanForMobile === 'ELITE') return elite;
    return pro;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-28 md:pb-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-volt" />
          <span>{t.membershipPage.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-textPrimary tracking-tight">
          {t.membershipPage.title}
        </h1>
        <p className="text-sm sm:text-base text-textMuted leading-relaxed">
          {t.membershipPage.subtitle}
        </p>
      </div>

      {/* Plan Type Selector (Single vs All Club) */}
      <div className="max-w-md mx-auto p-1.5 rounded-2xl bg-surface border border-border grid grid-cols-2 text-xs font-mono shadow-lg">
        <button
          onClick={() => setTier('SINGLE')}
          className={`py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tier === 'SINGLE' ? 'bg-volt text-black glow-volt shadow-md' : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          <span>{t.membershipPage.singleClub}</span>
        </button>
        <button
          onClick={() => setTier('ALL')}
          className={`py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tier === 'ALL' ? 'bg-volt text-black glow-volt shadow-md' : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{t.membershipPage.allClub}</span>
        </button>
      </div>

      {/* Duration Selector with Dynamic Savings in Rupiah */}
      <div className="space-y-3 text-center">
        <div className="text-[11px] font-mono text-textMuted uppercase tracking-wider">
          Pilih Durasi Komitmen (Diskon Otomatis Bertingkat)
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2.5">
          {[
            { m: 1, label: t.membershipPage.durations.m1, tag: null, savingsPct: null },
            { m: 3, label: t.membershipPage.durations.m3, tag: 'Hemat 15%', savingsPct: 15 },
            { m: 6, label: t.membershipPage.durations.m6, tag: 'Hemat 25%', savingsPct: 25 },
            { m: 12, label: t.membershipPage.durations.m12, tag: 'BEST VALUE (Hemat 40%)', savingsPct: 40 },
          ].map((d) => (
            <button
              key={d.m}
              onClick={() => setDuration(d.m)}
              className={`px-5 py-3 rounded-2xl border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden ${
                duration === d.m
                  ? 'bg-cyan/15 border-cyan text-cyan font-bold glow-cyan scale-105 shadow-md'
                  : 'bg-surface border-border text-textMuted hover:text-textPrimary hover:bg-elevated'
              }`}
            >
              <span>{d.label}</span>
              {d.tag && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  duration === d.m ? 'bg-cyan text-black' : 'bg-volt/10 text-volt border border-volt/30'
                }`}>
                  {d.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Code Input with Interactive Feedback */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-surface border border-border space-y-2 shadow-lg">
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t.membershipPage.promoPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-xs text-textPrimary uppercase font-mono focus:outline-none focus:border-volt transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-volt font-bold cursor-pointer transition-colors active:scale-95"
          >
            {t.membershipPage.apply}
          </button>
        </form>
        
        <AnimatePresence mode="wait">
          {promoMessage && (
            <motion.div
              key={promoMessage.text}
              initial={{ opacity: 0, y: -5, x: promoMessage.success ? 0 : -8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                x: promoMessage.success ? 0 : [0, -6, 6, -6, 6, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-[11px] font-mono p-2.5 rounded-xl border flex items-center gap-2 ${
                promoMessage.success 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {promoMessage.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
              <span>{promoMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plan Cards Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Card 1: Starter */}
        <div 
          onClick={() => setSelectedPlanForMobile('STARTER')}
          className={`p-8 rounded-3xl bg-surface border transition-all flex flex-col justify-between cursor-pointer md:cursor-default ${
            selectedPlanForMobile === 'STARTER' ? 'border-volt/50' : 'border-border hover:border-volt/30'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase text-textMuted font-bold tracking-wider">STARTER ACCESS</span>
              <span className="text-[10px] font-mono text-textMuted px-2 py-0.5 bg-elevated rounded-md">{t.membershipPage.flexible}</span>
            </div>
            
            <div>
              <div className="text-3xl font-display font-extrabold text-textPrimary">
                Rp {starter.perMonth.toLocaleString('id-ID')}
                <span className="text-xs font-mono text-textMuted font-normal">{t.membershipPage.perMonth}</span>
              </div>
              <div className="text-[11px] font-mono text-textMuted mt-1">
                {t.membershipPage.totalMonth.replace('{m}', duration.toString())} Rp {starter.finalTotal.toLocaleString('id-ID')}
              </div>

              {/* Exact Savings in Rupiah */}
              {starterSavings > 0 && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-volt/10 text-volt border border-volt/30 text-[10px] font-mono font-bold animate-pulse">
                  <TrendingDown className="w-3 h-3" />
                  <span>HEMAT Rp {starterSavings.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5 text-xs font-mono text-textMuted pt-4 border-t border-border">
              {t.membershipPage.starterFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 ${i < 4 ? 'text-textPrimary' : 'opacity-40'}`}>
                  {i < 4 ? <Check className="w-4 h-4 text-volt shrink-0" /> : <X className="w-4 h-4 shrink-0" />} 
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/checkout?plan=STARTER&tier=${tier}&duration=${duration}${promoQuery}`}
            className="w-full mt-6 py-3.5 rounded-xl bg-elevated hover:bg-surface border border-border text-center text-xs font-mono text-textPrimary font-bold transition-all block active:scale-95"
          >
            {t.membershipPage.selectStarter}
          </Link>
        </div>

        {/* Card 2: PRO (Featured - Most Popular) */}
        <div 
          onClick={() => setSelectedPlanForMobile('PRO')}
          className="p-8 rounded-3xl bg-surface border-2 border-volt space-y-6 flex flex-col justify-between relative glow-volt scale-102 shadow-2xl cursor-pointer md:cursor-default"
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-volt text-black text-[10px] font-display font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>{t.membershipPage.mostPopular}</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-mono uppercase text-volt font-bold tracking-wider">PRO ALL-ACCESS</span>
              <span className="text-[10px] font-mono text-cyan font-bold px-2 py-0.5 bg-cyan/10 border border-cyan/30 rounded-md">
                {t.membershipPage.recommended}
              </span>
            </div>
            
            <div>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-volt">
                Rp {pro.perMonth.toLocaleString('id-ID')}
                <span className="text-xs font-mono text-textMuted font-normal">{t.membershipPage.perMonth}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan mt-1">
                {t.membershipPage.totalMonth.replace('{m}', duration.toString())} Rp {pro.finalTotal.toLocaleString('id-ID')}
              </div>

              {/* Exact Savings in Rupiah */}
              {proSavings > 0 && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-volt text-black font-mono text-[11px] font-extrabold shadow-md glow-volt">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  <span>TOTAL HEMAT Rp {proSavings.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5 text-xs font-mono text-textMuted pt-4 border-t border-border">
              {t.membershipPage.proFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 text-textPrimary ${i === 0 ? 'font-bold text-volt' : ''}`}>
                  <Check className="w-4 h-4 text-volt shrink-0" /> 
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/checkout?plan=PRO&tier=${tier}&duration=${duration}${promoQuery}`}
            className="w-full mt-6 py-4 rounded-xl bg-volt text-black font-display font-extrabold text-xs text-center glow-volt hover:bg-[#b8ea29] transition-all block shadow-lg active:scale-95 uppercase tracking-wider"
          >
            {t.membershipPage.selectPro}
          </Link>
        </div>

        {/* Card 3: Elite VIP */}
        <div 
          onClick={() => setSelectedPlanForMobile('ELITE')}
          className={`p-8 rounded-3xl bg-surface border transition-all flex flex-col justify-between cursor-pointer md:cursor-default ${
            selectedPlanForMobile === 'ELITE' ? 'border-cyan/60' : 'border-border hover:border-cyan/40'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase text-cyan font-bold tracking-wider">ELITE VIP</span>
              <span className="text-[10px] font-mono text-orange font-bold px-2 py-0.5 bg-orange/10 border border-orange/30 rounded-md">
                {t.membershipPage.plus4pt}
              </span>
            </div>
            
            <div>
              <div className="text-3xl font-display font-extrabold text-textPrimary">
                Rp {elite.perMonth.toLocaleString('id-ID')}
                <span className="text-xs font-mono text-textMuted font-normal">{t.membershipPage.perMonth}</span>
              </div>
              <div className="text-[11px] font-mono text-textMuted mt-1">
                {t.membershipPage.totalMonth.replace('{m}', duration.toString())} Rp {elite.finalTotal.toLocaleString('id-ID')}
              </div>

              {/* Exact Savings in Rupiah */}
              {eliteSavings > 0 && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan/10 text-cyan border border-cyan/30 text-[10px] font-mono font-bold">
                  <TrendingDown className="w-3 h-3" />
                  <span>HEMAT Rp {eliteSavings.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5 text-xs font-mono text-textMuted pt-4 border-t border-border">
              {t.membershipPage.eliteFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 text-textPrimary ${i === 0 ? 'font-bold text-cyan' : ''}`}>
                  <Check className="w-4 h-4 text-cyan shrink-0" /> 
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/checkout?plan=ELITE&tier=${tier}&duration=${duration}${promoQuery}`}
            className="w-full mt-6 py-3.5 rounded-xl bg-elevated hover:bg-surface border border-cyan/40 text-center text-xs font-mono text-cyan font-bold transition-all block active:scale-95 uppercase tracking-wider"
          >
            {t.membershipPage.selectElite}
          </Link>
        </div>
      </div>

      {/* Feature Clarification / Glossary Tooltip Modal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {[
          { key: 'anti_passback', icon: ShieldCheck, color: 'text-volt' },
          { key: 'freeze_policy', icon: Zap, color: 'text-cyan' },
          { key: 'buddy_pass', icon: Gift, color: 'text-orange' },
          { key: 'sauna_recovery', icon: Flame, color: 'text-rose-400' },
        ].map(({ key, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
            className="p-4 rounded-2xl bg-surface border border-border text-left hover:border-white/20 transition-all flex items-start gap-3 cursor-pointer group"
          >
            <div className={`p-2 rounded-xl bg-background border border-border ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-display font-bold text-textPrimary flex items-center justify-between">
                <span>{featureExplanations[key].title}</span>
                <HelpCircle className="w-3 h-3 text-textMuted opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-textMuted mt-1 line-clamp-2 leading-relaxed">
                {featureExplanations[key].desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Popup for Feature Details */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-surface border border-volt/40 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <div className="flex justify-between items-start">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-volt/10 text-volt font-mono text-xs uppercase border border-volt/20">
                  <Info className="w-3.5 h-3.5" />
                  <span>KINETIC Guarantee</span>
                </div>
                <button 
                  onClick={() => setActiveTooltip(null)}
                  className="p-1.5 rounded-lg bg-elevated text-textMuted hover:text-textPrimary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-display font-extrabold text-textPrimary">
                {featureExplanations[activeTooltip].title}
              </h3>
              
              <p className="text-xs sm:text-sm text-textMuted leading-relaxed font-mono">
                {featureExplanations[activeTooltip].desc}
              </p>

              <button
                onClick={() => setActiveTooltip(null)}
                className="w-full py-3 rounded-xl bg-volt text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#b8ea29] transition-colors shadow-md"
              >
                Paham & Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Matrix Table */}
      <div className="p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-xl">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-display font-extrabold text-textPrimary">
            {t.membershipPage.compareTitle}
          </h3>
          <p className="text-xs text-textMuted font-mono">
            Perbandingan fitur komprehensif seluruh tier keanggotaan digital KINETIC.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-textMuted">
                <th className="py-3 px-4">{t.membershipPage.tableHeaders[0]}</th>
                <th className="py-3 px-4 text-center">{t.membershipPage.tableHeaders[1]}</th>
                <th className="py-3 px-4 text-center text-volt font-bold">{t.membershipPage.tableHeaders[2]}</th>
                <th className="py-3 px-4 text-center text-cyan font-bold">{t.membershipPage.tableHeaders[3]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {t.membershipPage.tableRows.map((row, i) => (
                <tr key={i} className="hover:bg-elevated/30 transition-colors">
                  <td className="py-3.5 px-4 text-textPrimary font-semibold">{row.feature}</td>
                  <td className={`py-3.5 px-4 text-center ${i === 1 || i === 3 || i === 4 ? 'text-textMuted' : 'text-volt font-bold'}`}>{row.starter}</td>
                  <td className={`py-3.5 px-4 text-center bg-volt/5 ${i === 1 ? 'text-volt font-bold' : i === 4 ? 'text-textMuted' : 'text-volt font-bold'}`}>{row.pro}</td>
                  <td className={`py-3.5 px-4 text-center ${i === 1 || i === 4 ? 'text-cyan font-bold' : i === 3 ? 'text-cyan' : 'text-volt font-bold'}`}>{row.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Sticky Mobile Checkout Bar (Visible only on mobile screen < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border p-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-volt/20 text-volt font-bold">
                {selectedPlanForMobile}
              </span>
              <span className="text-[11px] font-mono text-textMuted">
                · {duration} Bulan
              </span>
            </div>
            <div className="text-base font-display font-black text-textPrimary mt-0.5">
              Rp {getActiveMobilePrice().perMonth.toLocaleString('id-ID')}
              <span className="text-[10px] font-normal text-textMuted">/bln</span>
            </div>
          </div>

          <Link
            href={`/checkout?plan=${selectedPlanForMobile}&tier=${tier}&duration=${duration}${promoQuery}`}
            className="px-5 py-3 rounded-xl bg-volt text-black font-display font-extrabold text-xs flex items-center gap-1.5 shadow-lg glow-volt uppercase tracking-wider"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
