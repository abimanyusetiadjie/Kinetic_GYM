'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, QrCode, Copy, Check, Users, Gift } from 'lucide-react';

interface BuddyPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotaRemaining: number;
}

export default function BuddyPassModal({ isOpen, onClose, quotaRemaining }: BuddyPassModalProps) {
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName) return;
    const token = 'bp_' + Math.random().toString(36).substring(2, 10);
    const link = `https://kineticfit.id/pass/claim?token=${token}&guest=${encodeURIComponent(
      friendName
    )}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Halo ${friendName}! Aku baru saja kirim 1-Day Free Pass untuk gym bareng aku di KINETIC Tech Fitness Club. Klaim tiket QR Pass masukmu di sini: ${generatedLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider mb-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Viral WhatsApp Buddy Pass</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-textPrimary">
              Ajak Teman Gym Bareng
            </h3>
            <p className="text-xs text-textMuted mt-1">
              Kirimkan 1-Day Pass gratis langsung via WhatsApp tanpa perlu isi form kertas di resepsionis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-elevated hover:bg-surface border border-border text-textMuted hover:text-textPrimary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Badge */}
        <div className="my-5 p-3.5 rounded-2xl bg-elevated/70 border border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-textMuted font-mono">
            <Users className="w-4 h-4 text-cyan" />
            <span>Sisa Kuota Bulan Ini:</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-volt/10 text-volt border border-volt/30 font-mono font-bold text-xs">
            {quotaRemaining} Tiket Gratis
          </span>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-textMuted mb-2">
                Nama Panggilan Teman Anda
              </label>
              <input
                type="text"
                required
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Contoh: Rian / Jessica"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-textPrimary focus:outline-none focus:border-volt text-sm font-body"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-volt text-black font-display font-bold text-sm hover:bg-[#b8ea29] transition-all glow-volt flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Buat Link Tiket WhatsApp</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-background/80 border border-cyan/40 space-y-2">
              <div className="text-xs font-mono text-cyan flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>Link Tiket Buddy Pass Terbuat!</span>
              </div>
              <div className="text-xs text-textPrimary font-mono break-all bg-surface p-2.5 rounded-lg border border-border">
                {generatedLink}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="py-3 rounded-xl bg-elevated hover:bg-surface border border-border text-textPrimary text-xs font-mono flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-volt" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="py-3 rounded-xl bg-[#25D366] text-black font-display font-bold text-xs hover:bg-[#20bd5a] flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Kirim WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        <p className="text-[11px] font-mono text-textMuted mt-4 text-center">
          * Teman Anda akan menerima 1-Day Dynamic QR Pass yang langsung aktif hari ini.
        </p>
      </div>
    </div>
  );
}
