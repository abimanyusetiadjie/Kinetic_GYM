'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show prompt after 3 seconds for demo experience
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('📱 Untuk memasang aplikasi di HP:\n\n1. Di iPhone (Safari): Tekan tombol Share 📤 lalu pilih "Add to Home Screen".\n2. Di Android (Chrome): Tekan titik 3 ⋮ lalu pilih "Install App" / "Tambahkan ke Layar Utama".');
    }
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3.5 right-3.5 md:left-auto md:right-6 md:w-96 z-40 bg-surface/95 backdrop-blur-xl border border-volt/40 p-3.5 sm:p-4 rounded-3xl shadow-2xl dark:shadow-black/80 shadow-black/15 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 glow-volt">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-volt text-black flex items-center justify-center font-display font-extrabold text-sm shrink-0">
          K
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-display font-bold text-textPrimary flex items-center gap-1.5">
            <span>Pasang Aplikasi KINETIC</span>
            <span className="text-[9px] bg-volt/20 text-volt px-1.5 py-0.2 rounded font-mono font-bold">PWA</span>
          </div>
          <p className="text-[11px] text-textMuted leading-tight font-mono">
            Akses 1-klik Dynamic QR Pass tanpa antre
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-2 rounded-xl bg-volt text-black font-display font-extrabold text-xs hover:bg-[#b8ea29] transition-all flex items-center gap-1 shadow-md cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          onClick={() => setShowPrompt(false)}
          aria-label="Tutup Banner Install"
          className="p-2 rounded-xl text-textMuted hover:text-textPrimary hover:bg-elevated transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
