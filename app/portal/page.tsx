'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Flame,
  CalendarDays,
  BarChart3,
  UserCircle,
  Bell,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  LogOut,
  MapPin,
  Clock,
  Dumbbell
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';
import { useLanguage } from '@/context/LanguageContext';
import WorkoutAnalytics from '@/components/WorkoutAnalytics';

export default function MemberPortalPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'PASS' | 'BOOKINGS' | 'ANALYTICS'>('PASS');
  const [qrToken, setQrToken] = useState('KNT-9281-PASS-ACTIVE');
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  
  const [memberName, setMemberName] = useState('KINETIC ATHLETE');
  const [planName, setPlanName] = useState('PRO ALL CLUB');
  const [checkinsCount, setCheckinsCount] = useState(24);

  const [loadingAuth, setLoadingAuth] = useState(true);

  // Bookings Mock
  const [myBookings, setMyBookings] = useState([
    { id: 'bk_1', time: 'TODAY • 18:30', className: 'Les Mills BodyPump', spot: 'Mat A2', instructor: 'Sarah Jenkins', location: 'Sudirman SCBD' },
    { id: 'bk_2', time: 'TMRW • 07:30', className: 'Indoor Cycling (RPM)', spot: 'Bike #12', instructor: 'Coach Dimas', location: 'Sudirman SCBD' },
  ]);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Fallback for demo if not logged in
        setLoadingAuth(false);
      } else {
        setLoadingAuth(false);
      }
    });
  }, [supabase.auth]);

  // TOTP Simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          const newToken = 'KNT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          setQrToken(newToken);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateGateScan = () => {
    soundFx.playAccessGrantedSound();
    setCheckinsCount((prev) => prev + 1);
    setScanStatusMessage("ACCESS GRANTED: WELCOME TO KINETIC");

    setTimeout(() => {
      setScanStatusMessage(null);
    }, 4000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loadingAuth) {
    return <div className="min-h-[100dvh] bg-background flex items-center justify-center font-mono text-volt animate-pulse">AUTHENTICATING...</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-textPrimary flex flex-col font-sans selection:bg-volt selection:text-black">
      
      {/* NATIVE APP ILLUSION WRAPPER */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative shadow-2xl bg-background overflow-hidden border-x border-border">
        
        {/* Dynamic Background Mesh */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan/10 via-background to-background pointer-events-none"></div>

        {/* TOP APP BAR */}
        <header className="relative z-20 px-6 pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-volt to-cyan p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-textPrimary" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-textMuted uppercase tracking-widest">{planName}</div>
              <div className="text-sm font-display font-bold uppercase tracking-wide text-textPrimary">{memberName}</div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center border border-border relative text-textPrimary cursor-pointer shadow-sm">
            <Bell className="w-4 h-4 text-textPrimary" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-volt rounded-full animate-pulse"></div>
          </button>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pb-28 px-6 no-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: QR PASS (HOME) */}
            {activeTab === 'PASS' && (
              <motion.div
                key="tab-pass"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 pt-4"
              >
                {/* 3D FLOATING QR PASS */}
                <div className="perspective-1000 relative">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    onClick={handleSimulateGateScan}
                    className="relative w-full aspect-[3/4] max-h-[420px] mx-auto rounded-[2.5rem] p-1 cursor-pointer group preserve-3d"
                    style={{ background: 'linear-gradient(135deg, rgba(202,255,51,0.4) 0%, rgba(0,229,255,0.1) 100%)' }}
                  >
                    {/* Glass inner card */}
                    <div className="absolute inset-1 rounded-[2.3rem] bg-gray-900/90 dark:bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-between py-10 px-6 border border-white/20 shadow-2xl overflow-hidden text-white">
                      
                      {/* Decorative Flare */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 bg-volt/30 blur-[50px] rounded-full"></div>

                      <div className="text-center space-y-1 relative z-10">
                        <div className="flex justify-center mb-4">
                          <ShieldCheck className="w-6 h-6 text-volt" />
                        </div>
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">Dynamic Access Pass</h2>
                        <div className="text-2xl font-display font-black text-white tracking-tighter">KINETIC</div>
                      </div>

                      {/* QR Code Area */}
                      <div className="w-56 h-56 bg-white rounded-3xl p-4 relative z-10 flex items-center justify-center shadow-[0_0_50px_rgba(202,255,51,0.2)] group-hover:shadow-[0_0_80px_rgba(202,255,51,0.35)] transition-shadow">
                        <QrCode className="w-full h-full text-black" />
                        {/* Radar Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-volt shadow-[0_0_15px_rgba(202,255,51,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      </div>

                      <div className="w-full text-center relative z-10 space-y-3">
                        <div className="font-mono text-xl font-bold tracking-[0.2em] text-white">{qrToken}</div>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-cyan uppercase bg-cyan/15 py-1.5 px-4 rounded-full border border-cyan/30 w-fit mx-auto">
                          <RotateCw className="w-3 h-3 animate-spin" />
                          <span>Updates in {secondsRemaining}s</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Scan Status Toast */}
                <AnimatePresence>
                  {scanStatusMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-1/2 left-4 right-4 -translate-y-1/2 z-50 bg-volt text-black p-4 rounded-2xl font-display font-black text-center text-sm uppercase shadow-[0_0_40px_rgba(202,255,51,0.5)] border border-black/20"
                    >
                      {scanStatusMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Stats Banner */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-orange/20 text-orange flex items-center justify-center">
                      <Flame className="w-5 h-5 fill-orange" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-black text-textPrimary">12</div>
                      <div className="text-[10px] font-mono text-textMuted uppercase">Day Streak</div>
                    </div>
                  </div>
                  <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-cyan/20 text-cyan flex items-center justify-center">
                      <Zap className="w-5 h-5 fill-cyan" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-black text-textPrimary">{checkinsCount}</div>
                      <div className="text-[10px] font-mono text-textMuted uppercase">Check-ins</div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: BOOKINGS */}
            {activeTab === 'BOOKINGS' && (
              <motion.div
                key="tab-bookings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-black uppercase text-textPrimary">Your Classes</h2>
                  <Link href="/classes" className="text-[10px] font-mono text-volt uppercase border border-volt/30 px-3 py-1.5 rounded-full hover:bg-volt hover:text-black transition-colors font-bold">
                    Book New
                  </Link>
                </div>

                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="p-5 rounded-3xl bg-surface border border-border relative overflow-hidden group shadow-sm">
                      <div className="absolute top-0 left-0 w-1 h-full bg-volt"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-volt flex items-center gap-1.5 uppercase font-bold">
                            <Clock className="w-3 h-3" /> {booking.time}
                          </div>
                          <h3 className="text-lg font-display font-bold text-textPrimary">{booking.className}</h3>
                          <div className="text-xs text-textMuted">{booking.instructor}</div>
                        </div>
                        <div className="bg-elevated text-textPrimary font-mono text-xs px-3 py-1.5 rounded-lg border border-border font-bold">
                          {booking.spot}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-[10px] font-mono text-textMuted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan" /> {booking.location}
                        </div>
                        <button className="text-[10px] font-mono text-rose-500 uppercase tracking-widest hover:underline cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}

                  {myBookings.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-border rounded-3xl">
                      <Dumbbell className="w-8 h-8 text-textMuted/40 mx-auto mb-3" />
                      <div className="text-sm font-mono text-textMuted uppercase">No Active Bookings</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: ANALYTICS */}
            {activeTab === 'ANALYTICS' && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-4"
              >
                <h2 className="text-2xl font-display font-black uppercase text-textPrimary">Performance</h2>
                <WorkoutAnalytics />
                
                <div className="pt-8 space-y-4">
                  <button onClick={handleLogout} className="w-full py-4 rounded-2xl border border-rose-500/30 text-rose-500 font-mono text-xs uppercase flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-colors cursor-pointer font-bold">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* NATIVE BOTTOM NAVIGATION BAR */}
        <nav className="absolute bottom-0 left-0 w-full h-24 bg-surface/95 backdrop-blur-xl border-t border-border z-50 px-6 pb-6 pt-4 flex justify-between items-center shadow-lg">
          
          <button 
            onClick={() => setActiveTab('BOOKINGS')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-colors cursor-pointer ${activeTab === 'BOOKINGS' ? 'text-textPrimary font-bold' : 'text-textMuted hover:text-textPrimary'}`}
          >
            <CalendarDays className={`w-6 h-6 ${activeTab === 'BOOKINGS' ? 'text-volt' : ''}`} />
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Classes</span>
          </button>

          {/* Center Floating Action Button (QR PASS) */}
          <button 
            onClick={() => setActiveTab('PASS')}
            className={`relative -top-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
              activeTab === 'PASS' 
                ? 'bg-volt text-black shadow-[0_0_30px_rgba(202,255,51,0.4)] glow-volt' 
                : 'bg-surface border border-border text-textPrimary'
            }`}
          >
            <QrCode className="w-7 h-7" />
          </button>

          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-colors cursor-pointer ${activeTab === 'ANALYTICS' ? 'text-textPrimary font-bold' : 'text-textMuted hover:text-textPrimary'}`}
          >
            <BarChart3 className={`w-6 h-6 ${activeTab === 'ANALYTICS' ? 'text-volt' : ''}`} />
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Stats</span>
          </button>

        </nav>

        {/* iOS Home Indicator Mockup */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-textMuted/20 rounded-full z-50 pointer-events-none"></div>

      </div>
    </div>
  );
}
