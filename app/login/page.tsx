'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, ArrowRight, Loader2, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/portal');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black selection:bg-volt selection:text-black">
      
      {/* LEFT SIDE - VISUAL POSTER (Hidden on small mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-surface overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop"
          alt="Athlete training"
          fill
          className="object-cover object-center grayscale-[0.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-volt/10 to-transparent mix-blend-overlay"></div>
        
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-3 py-1 bg-volt/20 backdrop-blur-md text-volt text-[10px] font-mono uppercase tracking-[0.2em] mb-4 border border-volt/30">
              KINETIC Neural Link
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
              Defy<br/>The <span className="text-volt">Limit.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - ULTRA MINIMAL FORM */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-background relative">
        {/* Abstract flares */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Logo Mobile */}
          <Link href="/" className="md:hidden flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-volt flex items-center justify-center font-display font-black text-black">K</div>
            <span className="font-display font-black text-2xl tracking-tighter text-white">KINETIC.</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">Member Login</h2>
            <p className="text-xs font-mono text-textMuted uppercase tracking-wider">Access your dynamic QR Pass</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted group-focus-within:text-volt transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-white/20 text-white font-mono text-sm focus:outline-none focus:border-volt transition-colors rounded-none placeholder:text-white/20"
                  placeholder="athlete@kinetic.id"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] flex justify-between">
                <span>Passcode</span>
                <Link href="#" className="text-cyan/70 hover:text-cyan transition-colors">Recover</Link>
              </label>
              <div className="relative group">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted group-focus-within:text-volt transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-white/20 text-white font-mono text-sm focus:outline-none focus:border-volt transition-colors rounded-none placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 bg-white text-black font-display font-black text-sm uppercase tracking-widest hover:bg-volt transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>Initialize</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs font-mono text-textMuted">
              NO ACCOUNT?{' '}
              <Link href="/register" className="text-white hover:text-volt hover:underline underline-offset-4 transition-colors">
                ACQUIRE PASS
              </Link>
            </p>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
