'use client';

import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Terminal,
  ActivitySquare,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';
import { realtimeBus } from '@/lib/realtime-bus';
import { motion, AnimatePresence } from 'framer-motion';

interface GateLog {
  id: string;
  name: string;
  role: string;
  gateName: string;
  timestamp: string;
  status: 'GRANTED' | 'DENIED';
  reason?: string;
  verificationMethod: string;
}

export default function GateMonitorPage() {
  const [isGateOpenManual, setIsGateOpenManual] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeGateDevice, setActiveGateDevice] = useState<'IDLE' | 'OPEN_ENTRY_1' | 'OPEN_ENTRY_2'>('IDLE');
  const [logs, setLogs] = useState<GateLog[]>([
    {
      id: 'log_1',
      name: 'Budi Pratama',
      role: 'PRO_TIER',
      gateName: 'TURNSTILE_01',
      timestamp: '11:41:00',
      status: 'GRANTED',
      verificationMethod: 'TOTP_QR_SCAN',
    },
    {
      id: 'log_2',
      name: 'Siti Rahmawati',
      role: 'STARTER_TIER',
      gateName: 'TURNSTILE_02',
      timestamp: '11:39:12',
      status: 'GRANTED',
      verificationMethod: 'TOTP_QR_SCAN',
    },
    {
      id: 'log_4',
      name: 'Kevin Sanjaya',
      role: 'EXPIRED',
      gateName: 'TURNSTILE_01',
      timestamp: '11:32:05',
      status: 'DENIED',
      reason: 'ERR_SUBSCRIPTION_INACTIVE',
      verificationMethod: 'TOTP_QR_SCAN',
    },
  ]);

  useEffect(() => {
    const unsubscribe = realtimeBus.subscribe((event) => {
      if (event.type === 'MEMBER_SCAN_CHECKIN') {
        const { payload } = event;
        if (payload.status === 'GRANTED') {
          if (isAudioEnabled) {
            soundFx.playAccessGrantedSound();
            setTimeout(() => soundFx.playSolenoidClickSound(), 100);
          }
          setActiveGateDevice('OPEN_ENTRY_1');
          setTimeout(() => setActiveGateDevice('IDLE'), 4000);
        } else {
          if (isAudioEnabled) {
            soundFx.playAccessDeniedSound();
          }
        }

        const newLogItem: GateLog = {
          id: payload.id,
          name: payload.userName,
          role: payload.membershipTier.replace(' ', '_').toUpperCase(),
          gateName: payload.gateName.toUpperCase().replace(/ /g, '_'),
          timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
          status: payload.status,
          reason: payload.reason,
          verificationMethod: 'TOTP_QR_REALTIME',
        };

        setLogs((prev) => [newLogItem, ...prev]);
      }
    });

    return () => unsubscribe();
  }, [isAudioEnabled]);

  const handleManualOverride = () => {
    setIsGateOpenManual(true);
    setActiveGateDevice('OPEN_ENTRY_1');

    if (isAudioEnabled) {
      soundFx.playAccessGrantedSound();
      setTimeout(() => soundFx.playSolenoidClickSound(), 100);
    }

    const newLog: GateLog = {
      id: 'log_' + Date.now(),
      name: 'STAFF_OVERRIDE',
      role: 'ADMIN_AUTH',
      gateName: 'TURNSTILE_01',
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      status: 'GRANTED',
      verificationMethod: 'MANUAL_PULSE',
    };
    setLogs((prev) => [newLog, ...prev]);

    setTimeout(() => {
      setIsGateOpenManual(false);
      setActiveGateDevice('IDLE');
    }, 4000);
  };

  const isEntry1Open = isGateOpenManual || activeGateDevice === 'OPEN_ENTRY_1';

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 font-mono text-white">
      
      {/* Header */}
      <div className="border-b border-cyan/20 pb-6 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyan/10 border border-cyan/30 text-[10px] text-cyan uppercase tracking-[0.2em] mb-4">
            <Radio className="w-3 h-3 animate-pulse" /> LIVE_TELEMETRY_LINKED
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
            PHYSICAL <span className="text-cyan">ACCESS.</span>
          </h1>
        </div>

        <button
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className={`px-4 py-2 border text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors ${
            isAudioEnabled ? 'bg-cyan/10 border-cyan text-cyan' : 'bg-transparent border-white/20 text-white/50 hover:text-white'
          }`}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          AUDIO_FEED
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hardware Status (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] border-b border-cyan/20 pb-2 flex items-center gap-2">
            <ActivitySquare className="w-3 h-3" /> HARDWARE_NODES
          </div>

          <div className="space-y-4">
            {/* Turnstile 1 */}
            <div className={`p-6 border transition-all relative overflow-hidden ${
              isEntry1Open 
                ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                : 'bg-black border-cyan/30 shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]'
            }`}>
              {/* Scanline effect */}
              {isEntry1Open && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)] animate-[scan_1s_ease-in-out_infinite]"></div>}
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-display font-black tracking-tighter">TURNSTILE_01</div>
                <div className={`w-3 h-3 rounded-full ${isEntry1Open ? 'bg-emerald-400 animate-pulse' : 'bg-cyan'}`}></div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                  isEntry1Open ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-black text-cyan border-cyan/50'
                }`}>
                  {isEntry1Open ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div>
                  <div className={`text-2xl font-black ${isEntry1Open ? 'text-emerald-400' : 'text-cyan'}`}>
                    {isEntry1Open ? 'OPEN' : 'LOCKED'}
                  </div>
                  <div className="text-[10px] tracking-widest uppercase opacity-60">SOLENOID_STATE</div>
                </div>
              </div>

              <button
                onClick={handleManualOverride}
                disabled={isEntry1Open}
                className="w-full py-3 bg-rose-500/10 border border-rose-500 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> [ OVERRIDE_LOCK ]
              </button>
            </div>

            {/* Turnstile 2 */}
            <div className="p-6 bg-black border border-cyan/30 shadow-[inset_0_0_20px_rgba(0,229,255,0.05)] opacity-50 grayscale">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-display font-black tracking-tighter">TURNSTILE_02</div>
                <div className="w-3 h-3 rounded-full bg-cyan"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-black text-cyan border-2 border-cyan/50 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan">LOCKED</div>
                  <div className="text-[10px] tracking-widest uppercase opacity-60">STANDBY_MODE</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Logs Stream (Right) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="text-[10px] text-cyan uppercase tracking-[0.2em] border-b border-cyan/20 pb-2 flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> ACCESS_LOG_STREAM</span>
            <span className="opacity-50">SYNC: REALTIME</span>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0, 0, 0, 1)' }}
                  transition={{ duration: 0.5 }}
                  className={`p-4 border text-[10px] sm:text-xs grid grid-cols-12 gap-4 items-center ${
                    log.status === 'GRANTED' ? 'border-cyan/20 bg-black text-white' : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                  } ${idx === 0 ? 'border-l-4 border-l-cyan' : ''}`}
                >
                  <div className="col-span-2 tracking-widest opacity-60">
                    [{log.timestamp}]
                  </div>
                  
                  <div className="col-span-3 truncate">
                    {log.gateName}
                  </div>

                  <div className="col-span-5 truncate">
                    <span className="font-bold uppercase">{log.name}</span>
                    <span className="opacity-50 ml-2">({log.role})</span>
                    {log.reason && (
                      <div className="text-[9px] text-rose-400 mt-1 uppercase tracking-widest">ERR: {log.reason}</div>
                    )}
                  </div>

                  <div className="col-span-2 text-right font-bold tracking-widest uppercase flex justify-end items-center gap-2">
                    {log.status === 'GRANTED' ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> GRANTED</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-rose-500" /> DENIED</>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
