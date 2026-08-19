'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Target, QrCode, CheckCircle2, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Theme colors based on goal
  const themeColors: Record<string, string> = {
    '': 'from-background to-background',
    'weight_loss': 'from-[#0A0D14] to-cyan/20',
    'muscle_gain': 'from-[#0A0D14] to-orange/20',
    'endurance': 'from-[#0A0D14] to-volt/20',
    'flexibility': 'from-[#0A0D14] to-purple-500/20',
  };

  const glowColors: Record<string, string> = {
    '': '',
    'weight_loss': 'shadow-[0_0_100px_rgba(0,229,255,0.15)] border-cyan/50',
    'muscle_gain': 'shadow-[0_0_100px_rgba(255,94,30,0.15)] border-orange/50',
    'endurance': 'shadow-[0_0_100px_rgba(202,255,51,0.15)] border-volt/50',
    'flexibility': 'shadow-[0_0_100px_rgba(168,85,247,0.15)] border-purple-500/50',
  };

  const clubs = ['Sudirman SCBD', 'Senopati Lounge', 'Kuningan Epicentrum', 'Kelapa Gading'];
  const goals = [
    { id: 'weight_loss', label: 'Fat Shredding', desc: 'Turunkan berat badan ekstrim.', icon: '❄️', color: 'text-cyan border-cyan' },
    { id: 'muscle_gain', label: 'Hypertrophy', desc: 'Membangun massa otot maksimal.', icon: '🔥', color: 'text-orange border-orange' },
    { id: 'endurance', label: 'Athletic Engine', desc: 'Kardio dan stamina tanpa henti.', icon: '⚡', color: 'text-volt border-volt' },
    { id: 'flexibility', label: 'Mobility Flow', desc: 'Kelenturan dan keseimbangan.', icon: '🔮', color: 'text-purple-400 border-purple-500' },
  ];

  const handleNext = () => {
    if (step === 1 && selectedClub) {
      setStep(2);
    } else if (step === 2 && selectedGoal) {
      setStep(3);
      runAITerminal();
    }
  };

  const runAITerminal = () => {
    const lines = [
      "> INITIATING KINETIC NEURAL ENGINE...",
      `> ALLOCATING RESOURCES FOR ${selectedClub.toUpperCase()}...`,
      "> CALIBRATING BIOMETRIC BASELINE...",
      `> OPTIMIZING PROTOCOL: ${selectedGoal.toUpperCase()}`,
      "> GENERATING MICRO-CYCLE WORKOUTS...",
      "> SYNCING COACH AVAILABILITY...",
      "> PROTOCOL READY."
    ];
    
    let i = 0;
    setTerminalLines([]);
    
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(4), 1000);
      }
    }, 600);
  };

  return (
    <motion.div 
      className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 transition-colors duration-1000 bg-gradient-to-br ${themeColors[selectedGoal] || themeColors['']}`}
      animate={{ background: `linear-gradient(to bottom right, #0A0D14, var(--tw-gradient-to))` }}
    >
      {/* Brand logo top */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="text-xl font-display font-black tracking-tighter text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-volt rounded-br-lg rounded-tl-lg shadow-[0_0_15px_rgba(202,255,51,0.5)]"></div>
          KINETIC
        </Link>
      </div>

      <div className={`w-full max-w-2xl bg-black/40 backdrop-blur-3xl rounded-[2rem] p-8 sm:p-12 relative overflow-hidden transition-all duration-700 border border-white/10 ${glowColors[selectedGoal] || ''}`}>
        
        {/* Progress Bar (Cyberpunk style) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className={`h-full transition-colors duration-700 ${
              selectedGoal === 'weight_loss' ? 'bg-cyan' : 
              selectedGoal === 'muscle_gain' ? 'bg-orange' : 
              selectedGoal === 'flexibility' ? 'bg-purple-500' : 'bg-volt'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: Pilih Lokasi */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-volt font-mono text-[10px] uppercase tracking-widest bg-volt/10 px-3 py-1.5 rounded-full border border-volt/20">
                  <MapPin className="w-3.5 h-3.5" /> SELECT BASE
                </div>
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Pilih Home Club Anda</h2>
                <p className="text-sm font-mono text-textMuted">Tentukan markas utama Anda untuk optimasi jadwal lokal.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {clubs.map(club => (
                  <button
                    key={club}
                    onClick={() => setSelectedClub(club)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      selectedClub === club 
                        ? 'bg-volt/10 border-volt text-white shadow-[0_0_20px_rgba(202,255,51,0.2)] scale-[1.02]' 
                        : 'bg-white/5 border-white/10 text-textMuted hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="font-display font-bold text-lg uppercase tracking-wide">{club}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={!selectedClub}
                  className="px-8 py-4 rounded-xl bg-white text-black font-display font-black text-xs uppercase tracking-widest hover:bg-volt transition-colors disabled:opacity-30 disabled:hover:bg-white flex items-center gap-2"
                >
                  Confirm Base <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Pilih Goal (RPG Style) */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <Target className="w-3.5 h-3.5" /> SELECT PATH
                </div>
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Apa Tujuan Utama Anda?</h2>
                <p className="text-sm font-mono text-textMuted">Sistem AI kami akan menyesuaikan kelas dan pelatih berdasarkan jalur Anda.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 overflow-hidden relative group ${
                      selectedGoal === goal.id 
                        ? `bg-black ${goal.color} shadow-2xl scale-[1.02]` 
                        : 'bg-white/5 border-white/10 text-textMuted hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {/* Background flare on active */}
                    {selectedGoal === goal.id && (
                      <div className="absolute inset-0 bg-current opacity-10 pointer-events-none"></div>
                    )}
                    
                    <div className="text-3xl mb-3 relative z-10">{goal.icon}</div>
                    <div className="font-display font-black text-xl uppercase tracking-wide relative z-10">{goal.label}</div>
                    <div className="text-[10px] font-mono opacity-70 mt-2 relative z-10">{goal.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-[10px] font-mono text-textMuted uppercase hover:text-white transition-colors">
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedGoal}
                  className={`px-8 py-4 rounded-xl font-display font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 flex items-center gap-2 ${
                    selectedGoal === 'weight_loss' ? 'bg-cyan text-black' :
                    selectedGoal === 'muscle_gain' ? 'bg-orange text-black' :
                    selectedGoal === 'flexibility' ? 'bg-purple-400 text-black' :
                    selectedGoal === 'endurance' ? 'bg-volt text-black' :
                    'bg-white text-black'
                  }`}
                >
                  Initialize <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Loading AI Terminal */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-12 space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <Terminal className="w-6 h-6 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                  Compiling Protocol
                </h3>
              </div>
              
              <div className="font-mono text-xs sm:text-sm space-y-3 bg-black/60 border border-white/10 rounded-2xl p-6 min-h-[240px]">
                {terminalLines.map((line, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      line?.includes("READY") ? "text-volt font-bold" : 
                      line?.includes("OPTIMIZING") ? "text-cyan" : 
                      "text-textMuted"
                    }
                  >
                    {line}
                  </motion.div>
                ))}
                <div className="w-2 h-4 bg-white animate-pulse inline-block ml-1"></div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Hasil & CTA */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-6 text-center space-y-6"
            >
              {/* Official Brand Artwork Emblem Card */}
              <div className="relative w-full max-w-sm aspect-[16/9] mx-auto rounded-2xl overflow-hidden border border-volt/50 shadow-2xl shadow-volt/20 glow-volt">
                <Image
                  src="/images/kinetic-brand-hero.png"
                  alt="Official KINETIC Athlete Pass"
                  fill
                  className="object-cover object-center"
                />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tighter">Protocol Activated.</h2>
                <p className="text-xs sm:text-sm font-mono text-textMuted max-w-md mx-auto">
                  Profil atletik Anda telah terverifikasi dan disinkronkan ke <strong className="text-volt">{selectedClub}</strong>. Dynamic QR Pass Anda kini siap digunakan.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => router.push('/portal')}
                  className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-volt text-black font-display font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto glow-volt shadow-lg cursor-pointer"
                >
                  <QrCode className="w-5 h-5" />
                  Masuk Member Portal
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
