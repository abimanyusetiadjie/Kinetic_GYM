'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  DoorOpen,
  CreditCard,
  CalendarCheck,
  ArrowLeft,
  ShieldCheck,
  Radio,
  TerminalSquare,
  Cpu
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'SYS_OVERVIEW', href: '/admin', icon: Activity },
    { name: 'GATE_MONITOR', href: '/admin/gate', icon: DoorOpen, badge: 'LIVE' },
    { name: 'POS_TERMINAL', href: '/admin/pos', icon: CreditCard },
    { name: 'CLASS_ROSTER', href: '/admin/classes', icon: CalendarCheck },
  ];

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col md:flex-row font-mono selection:bg-volt selection:text-black relative overflow-hidden">
      
      {/* Background Grid Pattern (Radar-like) */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-black border-r border-cyan/20 p-6 flex flex-col justify-between shrink-0 relative z-10 shadow-[20px_0_50px_rgba(0,229,255,0.03)]">
        <div className="space-y-10">
          
          {/* Logo & Branch Indicator */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan text-black flex items-center justify-center font-display font-black text-xl shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                K
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-2xl tracking-tighter text-white">
                  KINETIC<span className="text-cyan">.</span>
                </span>
                <span className="text-[9px] text-cyan uppercase tracking-[0.3em] mt-1">Command Center</span>
              </div>
            </div>
            
            <div className="p-3 bg-cyan/5 border border-cyan/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan text-xs">
                <Radio className="w-4 h-4 animate-pulse text-cyan" />
                <span className="font-bold tracking-widest uppercase">NODE: SDIR-01</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3 px-3 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Core Modules
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 text-xs transition-all border-l-2 ${
                    isActive
                      ? 'bg-cyan/10 text-cyan border-cyan font-bold shadow-[inset_20px_0_30px_rgba(0,229,255,0.05)]'
                      : 'border-transparent text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 uppercase tracking-wider">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-cyan' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold tracking-widest uppercase ${isActive ? 'bg-cyan text-black' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Back to Main Web */}
        <div className="pt-6 border-t border-cyan/20 space-y-4">
          <div className="text-[10px] text-white/40 flex items-center gap-2 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-cyan" />
            <span>Auth: Lvl 5 (Staff)</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-cyan transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Console</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
