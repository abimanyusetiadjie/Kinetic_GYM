'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Award,
  CreditCard,
  QrCode,
  Menu,
  X,
  ShieldCheck,
  Radio,
  ChevronRight,
  User,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.nav.clubs, href: '/clubs', icon: MapPin },
    { name: t.nav.classes, href: '/classes', icon: Calendar },
    { name: t.nav.trainers, href: '/trainers', icon: Award },
    { name: t.nav.membership, href: '/membership', icon: CreditCard },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-volt text-black flex items-center justify-center font-display font-black text-lg sm:text-xl glow-volt group-hover:scale-105 transition-transform shadow-md">
              K
            </div>
            <div>
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-textPrimary">
                KINETIC<span className="text-volt">.</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-cyan px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/30">
                TECH GYM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface/80 p-1.5 rounded-2xl border border-border shadow-sm">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-volt text-black font-bold glow-volt shadow-sm'
                      : 'text-textMuted hover:text-textPrimary hover:bg-elevated'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Switcher Toggle */}
            <ThemeToggle showLabel={false} />

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-elevated/70 hover:bg-surface border border-border text-xs font-mono text-textMuted hover:text-textPrimary transition-all cursor-pointer shadow-sm active:scale-95"
              title="Ganti Bahasa (ID/EN)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-bold">{language}</span>
            </button>

            {/* Member Portal Button */}
            <Link
              href="/portal"
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-sm ${
                isActive('/portal')
                  ? 'bg-cyan text-black border-cyan glow-cyan'
                  : 'bg-elevated/80 border-border text-cyan hover:bg-surface hover:border-cyan/40'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Member Pass</span>
            </Link>

            {/* Join CTA */}
            <Link
              href="/membership"
              className="px-5 py-2.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs hover:bg-[#b8ea29] transition-all glow-volt flex items-center justify-center shadow-md active:scale-95 uppercase tracking-wider"
            >
              <span>{t.nav.join}</span>
            </Link>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <Link
              href="/portal"
              className="p-2 rounded-xl bg-volt/10 border border-volt/30 text-volt"
              title="Member QR Pass"
            >
              <QrCode className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-border text-textPrimary hover:text-volt transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-volt" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface/98 backdrop-blur-2xl px-5 py-6 space-y-5 animate-in slide-in-from-top-4 shadow-2xl">
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-mono transition-all ${
                    active
                      ? 'bg-volt text-black font-bold glow-volt'
                      : 'text-textMuted hover:text-textPrimary hover:bg-elevated'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-mono text-textMuted">Tampilan & Bahasa</span>
              <div className="flex items-center gap-2">
                <ThemeToggle showLabel={true} />
                <button
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-elevated border border-border text-xs font-mono text-textPrimary"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="uppercase font-bold">{language}</span>
                </button>
              </div>
            </div>

            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-cyan/15 border border-cyan/40 text-cyan text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.nav.portal}</span>
            </Link>

            <Link
              href="/membership"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-volt text-black text-xs font-display font-extrabold flex items-center justify-center glow-volt shadow-lg uppercase tracking-wider"
            >
              <span>{t.nav.join}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
