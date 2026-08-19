'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  DoorOpen,
  DollarSign,
  TrendingUp,
  Radio,
  Database,
  CheckCircle2,
  Terminal,
  ActivitySquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState<string | null>(null);
  
  // Real-time simulation state
  const [crowdCount, setCrowdCount] = useState(82);
  const [revenue, setRevenue] = useState(8420000);

  useEffect(() => {
    // Simulate live data fluctuating
    const interval = setInterval(() => {
      setCrowdCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(10, Math.min(150, prev + change));
      });
      setRevenue(prev => prev + (Math.random() > 0.7 ? 250000 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      setSeedSuccessMessage(
        `> SUCCESS: INJECTED ${data.summary.totalClubs} NODES, ${data.summary.citiesCovered} REGIONS, ${data.summary.schedulesGenerated} PROTOCOLS.`
      );
      setTimeout(() => setSeedSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-cyan/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyan/10 border border-cyan/30 text-[10px] text-cyan uppercase tracking-[0.2em] mb-4">
            <Terminal className="w-3 h-3" /> System Console_v2.4
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
            Network <span className="text-cyan">Telemetry.</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="px-4 py-2 bg-black border border-volt/50 text-volt text-[10px] uppercase tracking-widest hover:bg-volt hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {isSeeding ? 'INJECTING DATA...' : 'SEED DATABASE'}
          </button>

          <Link
            href="/admin/gate"
            className="px-4 py-2 bg-black border border-cyan/50 text-cyan text-[10px] uppercase tracking-widest hover:bg-cyan hover:text-black transition-colors flex items-center gap-2 group"
          >
            <Radio className="w-4 h-4 text-cyan group-hover:text-black animate-pulse" />
            LIVE GATE
          </Link>

          <Link
            href="/admin/pos"
            className="px-6 py-2 bg-cyan text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            LAUNCH POS
          </Link>
        </div>
      </div>

      {/* Terminal Alert Banner */}
      <AnimatePresence>
        {seedSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-volt/10 border border-volt/40 text-volt text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(202,255,51,0.1)]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="tracking-widest">{seedSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 bg-black border border-cyan/20 space-y-4 relative overflow-hidden group hover:border-cyan transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-cyan" />
          </div>
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2">
            <ActivitySquare className="w-3 h-3 animate-pulse" /> Live Density
          </div>
          <div>
            <div className="text-4xl font-display font-black text-white">
              {crowdCount} <span className="text-sm font-mono text-white/40">/ 150</span>
            </div>
            <div className="text-[10px] text-white/50 tracking-widest mt-1">PEOPLE IN FACILITY</div>
          </div>
          <div className="h-1 w-full bg-white/10 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]"
              animate={{ width: `${(crowdCount / 150) * 100}%` }}
              transition={{ type: 'spring', bounce: 0 }}
            ></motion.div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-black border border-cyan/20 space-y-4 relative overflow-hidden group hover:border-cyan transition-colors">
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2">
            <DoorOpen className="w-3 h-3" /> Today's Check-ins
          </div>
          <div>
            <div className="text-4xl font-display font-black text-white">418</div>
            <div className="text-[10px] text-volt tracking-widest mt-1">+12% VS YESTERDAY</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px] text-white/40 tracking-widest pt-2 border-t border-white/10">
            <div>GATE 1: 48%</div>
            <div>GATE 2: 52%</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-black border border-cyan/20 space-y-4 relative overflow-hidden group hover:border-cyan transition-colors">
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2">
            <DollarSign className="w-3 h-3" /> Walk-in Revenue
          </div>
          <div>
            <div className="text-3xl font-display font-black text-white">
              Rp {(revenue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-white/50 tracking-widest mt-1">LAST 24 HOURS</div>
          </div>
          <div className="text-[9px] text-white/40 tracking-widest pt-2 border-t border-white/10">
            RECENT: 14 DAY PASS, 4 NEW BINDINGS
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-black border border-cyan/20 space-y-4 relative overflow-hidden group hover:border-cyan transition-colors">
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2">
            <Database className="w-3 h-3" /> Network Status
          </div>
          <div>
            <div className="text-4xl font-display font-black text-white">51</div>
            <div className="text-[10px] text-emerald-400 tracking-widest mt-1">NODES ONLINE</div>
          </div>
          <div className="text-[9px] text-white/40 tracking-widest pt-2 border-t border-white/10">
            SERVER: STABLE (12MS PING)
          </div>
        </div>

      </div>

      {/* Bottom Area - Activity Stream */}
      <div className="p-5 bg-black border border-cyan/20">
        <div className="text-[10px] text-cyan uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">
          Live Activity Stream
        </div>
        <div className="space-y-2 h-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none"></div>
          {/* Mock log stream */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`text-[10px] tracking-widest flex items-center gap-4 ${i === 0 ? 'text-white' : 'text-white/40'}`}>
              <span className="text-cyan">[{new Date(Date.now() - i * 14000).toISOString().split('T')[1].slice(0, 8)}]</span>
              <span className={i === 0 ? 'text-volt' : ''}>{i % 3 === 0 ? 'ACCESS GRANTED' : i % 3 === 1 ? 'POS TRANSACTION' : 'CLASS BOOKING'}</span>
              <span className="truncate">USER_{Math.floor(Math.random() * 9000) + 1000} AT NODE_SDIR</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
