'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MapPin,
  Calendar,
  Award,
  QrCode,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide bottom nav on specific fullscreen pages if needed (e.g. onboarding)
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: t.nav.clubs || 'Cabang', href: '/clubs', icon: MapPin },
    { name: t.nav.classes || 'Kelas', href: '/classes', icon: Calendar },
    { name: t.nav.trainers || 'Pelatih', href: '/trainers', icon: Award },
    { name: 'QR Pass', href: '/portal', icon: QrCode, isHighlighted: true },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-2xl border-t border-border px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_35px_rgba(0,0,0,0.85)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isHighlighted) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-volt text-black flex items-center justify-center shadow-lg shadow-volt/30 glow-volt active:scale-90 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider mt-1 font-bold ${
                  isActive ? 'text-volt' : 'text-textMuted'
                }`}>
                  Pass
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 group"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-volt stroke-[2.5]' : 'text-textMuted group-hover:text-textPrimary'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-volt rounded-full glow-volt"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-mono mt-1 transition-colors ${
                  isActive ? 'text-volt font-bold' : 'text-textMuted group-hover:text-textPrimary'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
