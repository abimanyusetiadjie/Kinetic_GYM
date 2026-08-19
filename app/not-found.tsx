import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-lg">
        {/* Glowing 404 text */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-display font-black text-volt glow-volt">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-display font-black text-black opacity-20 pointer-events-none">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-textPrimary">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-textMuted font-mono">
            Maaf, rute yang Anda cari tidak tersedia atau sedang dalam perbaikan. 
            Silakan kembali ke gym floor utama.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs glow-volt hover:bg-[#b8ea29] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/clubs"
            className="px-6 py-3.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Cari Cabang KINETIC</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
