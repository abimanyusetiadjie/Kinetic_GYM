'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Send,
  Tag,
  Instagram,
  Youtube,
  CheckCircle2,
  ArrowUpRight,
  QrCode
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/Motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 5000);
    setEmail('');
  };

  return (
    <footer className="relative bg-surface/50 border-t border-border mt-auto pt-20 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-volt/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Asymmetrical Grid: 60 / 40 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-20">
          
          {/* LEFT SIDE (60%) - Brand, Socials, Newsletter */}
          <ScrollReveal className="lg:col-span-7 flex flex-col justify-between space-y-12 pr-0 lg:pr-12">
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-volt text-black flex items-center justify-center font-display font-black text-2xl glow-volt shadow-lg shadow-volt/20">
                  K
                </div>
                <span className="font-display font-black text-3xl sm:text-4xl tracking-tight text-textPrimary uppercase">
                  {t.footer.brand}<span className="text-volt">.</span>
                </span>
              </div>
              <p className="text-sm sm:text-base text-textMuted leading-relaxed max-w-md font-mono">
                Akses bebas 50+ cabang di 12 kota, Interactive Studio Spot Picker, dan Predictive Crowd Forecast AI. {t.footer.brandDesc}
              </p>
            </div>

            {/* Newsletter Minimalist Form */}
            <form onSubmit={handleSubscribe} className="space-y-3 max-w-md bg-surface border border-border p-5 rounded-2xl shadow-sm">
              <div className="text-[11px] font-mono text-cyan uppercase tracking-widest font-bold flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                Dapatkan Promo Eksklusif
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Anda..."
                  required
                  className="flex-1 bg-background border border-border text-sm text-textPrimary px-4 py-3 rounded-xl focus:outline-none focus:border-volt transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-volt text-black font-display font-black text-xs uppercase tracking-wider glow-volt hover:opacity-90 transition-all flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </div>
              {isSubscribed && (
                <div className="text-[10px] font-mono text-volt flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sip! Kode promo telah meluncur ke email Anda.</span>
                </div>
              )}
            </form>

            {/* Social & CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
              <a href="#" aria-label="Instagram" className="p-3 rounded-full bg-surface border border-border text-textMuted hover:text-textPrimary hover:border-textPrimary transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="p-3 rounded-full bg-surface border border-border text-textMuted hover:text-rose-500 hover:border-rose-500 transition-all hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
              
              <div className="h-8 w-px bg-border hidden sm:block"></div>
              
              <Link href="/portal" className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 text-cyan text-[11px] font-mono uppercase font-bold hover:bg-cyan/10 transition-colors">
                <QrCode className="w-3.5 h-3.5" />
                <span>Buka QR Pass</span>
              </Link>
            </div>

          </ScrollReveal>

          {/* RIGHT SIDE (40%) - Quick Links & Compliance */}
          <ScrollReveal delay={0.2} className="lg:col-span-5 grid grid-cols-2 gap-8 pt-4">
            
            {/* Navigasi 1 */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-volt font-bold border-l-2 border-volt pl-3">
                Eksplorasi
              </div>
              <ul className="space-y-4 text-xs sm:text-sm font-mono text-textMuted">
                <li>
                  <Link href="/clubs" className="hover:text-textPrimary transition-colors flex items-center gap-2 group">
                    <span>Cari Cabang (50+)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-volt" />
                  </Link>
                </li>
                <li>
                  <Link href="/classes" className="hover:text-textPrimary transition-colors flex items-center gap-2 group">
                    <span>Jadwal Kelas</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-volt" />
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="hover:text-textPrimary transition-colors flex items-center gap-2 group">
                    <span>Membership</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-volt" />
                  </Link>
                </li>
                <li>
                  <Link href="/trainers" className="hover:text-textPrimary transition-colors flex items-center gap-2 group">
                    <span>Personal Trainer</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-volt" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navigasi 2 */}
            <div className="space-y-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan font-bold border-l-2 border-cyan pl-3">
                Legalitas
              </div>
              <ul className="space-y-4 text-xs sm:text-sm font-mono text-textMuted">
                <li>
                  <Link href="/terms" className="hover:text-textPrimary transition-colors">Syarat Ketentuan</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-textPrimary transition-colors">Kebijakan Privasi</Link>
                </li>
              </ul>
              
              <div className="pt-6 space-y-3">
                <div className="flex items-start gap-2 text-[10px] font-mono text-textMuted">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sertifikasi UU PDP 2022</span>
                </div>
                <div className="flex items-start gap-2 text-[10px] font-mono text-textMuted">
                  <ShieldCheck className="w-3.5 h-3.5 text-volt shrink-0 mt-0.5" />
                  <span>PCI-DSS Encrypted</span>
                </div>
              </div>
            </div>

          </ScrollReveal>
        </div>

        {/* BOTTOM MASSIVE TYPOGRAPHY */}
        <ScrollReveal delay={0.3} direction="up" className="relative w-full border-t border-border pt-8 pb-4 flex flex-col items-center justify-center overflow-hidden">
          <div className="text-[20vw] lg:text-[14rem] leading-[0.75] font-display font-black text-textPrimary/[0.04] select-none tracking-tighter uppercase w-full text-center whitespace-nowrap">
            KINETIC<span className="text-volt/[0.12]">.</span>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-0 text-[10px] font-mono text-textMuted uppercase tracking-widest">
            <div>© {new Date().getFullYear()} PT KINETIC Fitness Indonesia.</div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <div className="w-1.5 h-1.5 rounded-full bg-volt animate-ping"></div>
              <span>System Online</span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </footer>
  );
}
