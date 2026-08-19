'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';
import { realtimeBus } from '@/lib/realtime-bus';
import { waService } from '@/lib/whatsapp-service';
import { getPlanPrices, validatePromoCode } from '@/lib/pricing';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'PRO';
  const tierParam = searchParams.get('tier') || 'ALL';
  const durationParam = parseInt(searchParams.get('duration') || '3', 10);
  const promoParam = searchParams.get('promo') || '';

  // Multi-step state
  const [step, setStep] = useState<1 | 2>(1);

  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'BCA_VA' | 'CC'>('QRIS');
  const [isPaid, setIsPaid] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);
  const [seconds, setSeconds] = useState(899);

  // Customer Data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Credit Card Data
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [xenditInvoiceUrl, setXenditInvoiceUrl] = useState('');

  // Price calculations
  const baseSingle = planParam === 'STARTER' ? 399000 : planParam === 'ELITE' ? 699000 : 499000;
  const baseAll = planParam === 'STARTER' ? 499000 : planParam === 'ELITE' ? 899000 : 649000;
  
  const promoValidation = validatePromoCode(promoParam);
  const appliedDiscount = promoValidation.success ? promoValidation.discount : 0;

  const prices = getPlanPrices(tierParam as 'SINGLE' | 'ALL', durationParam, appliedDiscount, baseSingle, baseAll);
  const finalTotal = prices.finalTotal;
  const netMonthly = Math.round(prices.subtotal / durationParam);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText('827719283749102');
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const proceedToPayment = () => {
    if (!customerName || !customerPhone || !customerEmail) {
      alert("Harap isi semua data diri dengan lengkap.");
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const orderId = 'KNT-ORD-' + Date.now().toString().slice(-6);
    const planTitle = `${planParam} ${tierParam === 'ALL' ? 'ALL CLUB' : 'SINGLE CLUB'} (${durationParam} Bulan)`;

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: finalTotal,
          planName: planTitle,
          customerName,
          customerPhone,
          customerEmail,
        }),
      });

      const data = await res.json();
      
      if (data.invoice_url) {
        setXenditInvoiceUrl(data.invoice_url);
        
        setTimeout(() => {
          setIsPaid(true);
          setIsProcessing(false);
          soundFx.playCashRegisterSound();

          realtimeBus.publish({
            type: 'MEMBERSHIP_PURCHASED',
            payload: {
              orderId,
              customerName: customerName,
              planName: planTitle,
              amount: finalTotal,
              timestamp: new Date().toLocaleTimeString('id-ID'),
            },
          });

          waService.sendInvoiceNotification(
            customerName,
            customerPhone,
            orderId,
            finalTotal,
            planTitle
          );
        }, 2500); // Simulated loading time
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Gagal memproses pembayaran");
    }
  };

  // Format CC Number
  const handleCcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCcNumber(formatted);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-[80vh]">
      {/* Header */}
      {!isPaid && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
            <span className={step >= 1 ? 'text-volt font-bold' : 'text-textMuted'}>1. Data Diri</span>
            <span className="text-border">————</span>
            <span className={step >= 2 ? 'text-volt font-bold' : 'text-textMuted'}>2. Pembayaran</span>
          </div>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight">
            {step === 1 ? 'Lengkapi Profil Anda' : 'Pilih Metode Pembayaran'}
          </h1>
        </div>
      )}

      {isPaid ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="p-8 sm:p-14 rounded-3xl bg-surface border-2 border-volt text-center space-y-8 max-w-2xl mx-auto glow-volt animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 rounded-full bg-volt/20 text-volt border border-volt/40 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(202,255,51,0.3)]">
            <CheckCircle2 className="w-14 h-14" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
              Akses Diberikan.
            </h2>
            <p className="text-xs font-mono text-cyan uppercase tracking-widest bg-cyan/10 px-4 py-2 rounded-full inline-block border border-cyan/20">
              Order: KNT-ORD-{Date.now().toString().slice(-6)} • {planParam} {tierParam}
            </p>
            <p className="text-sm text-textMuted max-w-sm mx-auto pt-4 leading-relaxed">
              Membership Anda telah aktif. Buka Portal Member untuk mengambil Dynamic QR Pass Anda dan rasakan akses gym tanpa hambatan.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portal"
              className="px-8 py-4 rounded-xl bg-volt text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 glow-volt hover:bg-white transition-all cursor-pointer"
            >
              <QrCode className="w-5 h-5" />
              <span>Buka Member Portal</span>
            </Link>
          </div>
        </div>
      ) : (
        /* CHECKOUT GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: FORM (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: DATA DIRI */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                <div className="p-8 rounded-3xl bg-surface border border-border space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Nama Lengkap Sesuai KTP</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm text-white focus:outline-none focus:border-volt transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Nomor WhatsApp Aktif</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812..."
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm text-white focus:outline-none focus:border-volt transition-colors"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Alamat Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm text-white focus:outline-none focus:border-volt transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={proceedToPayment}
                    className="px-8 py-4 rounded-2xl bg-volt text-black font-display font-black text-xs uppercase tracking-wider hover:bg-white transition-all glow-volt flex items-center gap-2"
                  >
                    Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[10px] font-mono text-textMuted hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Kembali Edit Data
                </button>

                <div className="p-8 rounded-3xl bg-surface border border-border space-y-6">
                  
                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setPaymentMethod('QRIS')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'QRIS' ? 'bg-volt/10 border-volt text-white shadow-[0_0_20px_rgba(202,255,51,0.15)]' : 'bg-background border-border text-textMuted hover:border-white/30'
                      }`}
                    >
                      <QrCode className={`w-6 h-6 ${paymentMethod === 'QRIS' ? 'text-volt' : 'text-textMuted'}`} />
                      <div className="space-y-1">
                        <div className="text-sm font-bold">QRIS</div>
                        <div className="text-[10px] font-mono uppercase">E-Wallet / M-Banking</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('CC')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'CC' ? 'bg-cyan/10 border-cyan text-white shadow-[0_0_20px_rgba(0,229,255,0.15)]' : 'bg-background border-border text-textMuted hover:border-white/30'
                      }`}
                    >
                      <CreditCardIcon className={`w-6 h-6 ${paymentMethod === 'CC' ? 'text-cyan' : 'text-textMuted'}`} />
                      <div className="space-y-1">
                        <div className="text-sm font-bold">Kartu Kredit</div>
                        <div className="text-[10px] font-mono uppercase">Visa / Mastercard</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('BCA_VA')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'BCA_VA' ? 'bg-orange/10 border-orange text-white shadow-[0_0_20px_rgba(255,94,30,0.15)]' : 'bg-background border-border text-textMuted hover:border-white/30'
                      }`}
                    >
                      <Building2 className={`w-6 h-6 ${paymentMethod === 'BCA_VA' ? 'text-orange' : 'text-textMuted'}`} />
                      <div className="space-y-1">
                        <div className="text-sm font-bold">BCA VA</div>
                        <div className="text-[10px] font-mono uppercase">Virtual Account</div>
                      </div>
                    </button>
                  </div>

                  {/* Payment Details View */}
                  <div className="pt-6 border-t border-border mt-6">
                    
                    {/* QRIS VIEW */}
                    {paymentMethod === 'QRIS' && (
                      <div className="text-center space-y-6 animate-in fade-in duration-300">
                        <div className="text-[10px] font-mono text-cyan uppercase tracking-widest bg-cyan/10 px-4 py-2 rounded-full inline-block border border-cyan/20">Scan dengan aplikasi M-Banking/E-Wallet</div>
                        <div className="w-56 h-56 bg-white rounded-3xl mx-auto flex items-center justify-center p-4 relative overflow-hidden shadow-2xl">
                          <QrCode className="w-full h-full text-black" />
                          {/* Scanning line animation */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-volt shadow-[0_0_15px_rgba(202,255,51,0.8)] animate-[scan_3s_ease-in-out_infinite]"></div>
                        </div>
                        <div className="text-[11px] font-mono text-textMuted uppercase tracking-widest">
                          Batas waktu pembayaran: <strong className="text-volt">{formatTimer(seconds)}</strong>
                        </div>
                      </div>
                    )}

                    {/* CREDIT CARD VIEW (Interactive) */}
                    {paymentMethod === 'CC' && (
                      <div className="space-y-8 animate-in fade-in duration-300">
                        
                        {/* 3D Card Animation Container (Mobile Responsive Scaling) */}
                        <div className="perspective-1000 mx-auto w-full max-w-[320px] sm:max-w-sm h-48 sm:h-56">
                          <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isCvvFocused ? 'rotate-y-180' : ''}`}>
                            
                            {/* Front of Card */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-black rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/20 rounded-full blur-3xl"></div>
                              <div className="flex justify-between items-center relative z-10">
                                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-cyan" />
                                <div className="text-[11px] sm:text-xs font-mono font-bold italic text-white/50">KINETIC PAY</div>
                              </div>
                              <div className="space-y-2 relative z-10">
                                <div className="text-lg sm:text-2xl font-mono tracking-widest text-white shadow-sm">
                                  {ccNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="flex justify-between items-end">
                                  <div className="text-[9px] sm:text-[10px] font-mono text-white/60 uppercase tracking-widest truncate max-w-[180px]">
                                    {customerName || 'NAMA PEMILIK'}
                                  </div>
                                  <div className="text-[11px] sm:text-xs font-mono text-white tracking-widest">
                                    {ccExpiry || 'MM/YY'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Back of Card */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-bl from-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-center overflow-hidden">
                              <div className="w-full h-10 sm:h-12 bg-black/80 mb-4 sm:mb-6"></div>
                              <div className="px-5 sm:px-6 space-y-1 relative z-10">
                                <div className="text-[8px] font-mono text-white/50 text-right uppercase">Security Code (CVV)</div>
                                <div className="w-full bg-white/10 h-9 sm:h-10 rounded-lg flex items-center justify-end px-4 text-white font-mono tracking-widest text-sm sm:text-base">
                                  {ccCvv || '•••'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Inputs with iOS auto-zoom prevention (text-base on mobile) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Nomor Kartu</label>
                            <input
                              type="text"
                              maxLength={19}
                              value={ccNumber}
                              onChange={handleCcChange}
                              onFocus={() => setIsCvvFocused(false)}
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-base sm:text-sm text-white font-mono tracking-widest focus:outline-none focus:border-cyan transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Valid Thru</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={ccExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                setCcExpiry(val);
                              }}
                              onFocus={() => setIsCvvFocused(false)}
                              placeholder="MM/YY"
                              className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-base sm:text-sm text-white font-mono tracking-widest focus:outline-none focus:border-cyan transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest">CVV</label>
                            <input
                              type="text"
                              maxLength={3}
                              value={ccCvv}
                              onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ''))}
                              onFocus={() => setIsCvvFocused(true)}
                              onBlur={() => setIsCvvFocused(false)}
                              placeholder="123"
                              className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-base sm:text-sm text-white font-mono tracking-widest focus:outline-none focus:border-cyan transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BCA VA VIEW */}
                    {paymentMethod === 'BCA_VA' && (
                      <div className="text-center space-y-6 animate-in fade-in duration-300">
                        <div className="text-[10px] font-mono text-orange uppercase tracking-widest bg-orange/10 px-4 py-2 rounded-full inline-block border border-orange/20">Bank Transfer / Virtual Account</div>
                        <div className="p-6 rounded-2xl bg-background border border-border flex flex-col sm:flex-row items-center justify-between gap-4 max-w-sm mx-auto">
                          <span className="font-mono text-2xl font-bold text-white tracking-widest">
                            8277 1928 3749 102
                          </span>
                          <button
                            onClick={handleCopyVA}
                            className="p-3 rounded-xl bg-surface hover:bg-elevated border border-border text-xs font-mono text-white flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            {copiedVA ? <Check className="w-4 h-4 text-orange" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="text-[11px] font-mono text-textMuted uppercase tracking-widest">
                          Sistem akan memverifikasi otomatis dalam 10 detik setelah transfer.
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Final Checkout Button */}
                <div className="pt-4">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || (paymentMethod === 'CC' && ccNumber.length < 19)}
                    className="w-full py-5 rounded-2xl bg-volt text-black font-display font-black text-sm uppercase tracking-wider hover:bg-white transition-all glow-volt flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-volt group overflow-hidden relative"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memproses Enkripsi 256-bit...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Bayar Sekarang — Rp {finalTotal.toLocaleString('id-ID')}</span>
                        {/* Shimmer effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer"></div>
                      </>
                    )}
                  </button>
                  <div className="text-center mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-textMuted">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Diamankan oleh infrastruktur PCI-DSS Tier-1.
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY (4 cols) - STICKY */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="p-8 rounded-3xl bg-surface border border-border space-y-6 shadow-2xl relative overflow-hidden">
              {/* Decorative background shape */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-volt/5 rounded-full blur-3xl pointer-events-none"></div>

              <h3 className="text-sm font-display font-black text-white uppercase tracking-widest border-b border-white/10 pb-4">
                Ringkasan Transaksi
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center group">
                  <span className="text-textMuted group-hover:text-white transition-colors">Paket Keanggotaan</span>
                  <span className="text-white font-bold">{planParam} {tierParam === 'ALL' ? 'ALL CLUB' : 'SINGLE'}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textMuted group-hover:text-white transition-colors">Durasi Komitmen</span>
                  <span className="text-white font-bold">{durationParam} Bulan</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textMuted group-hover:text-white transition-colors">Biaya Per Bulan</span>
                  <span className="text-textMuted">Rp {netMonthly.toLocaleString('id-ID')}</span>
                </div>
                
                {prices.durDiscount > 0 && (
                  <div className="flex justify-between items-center text-volt pt-2">
                    <span>Diskon Komitmen</span>
                    <span>- {prices.durDiscount.toFixed(0)}%</span>
                  </div>
                )}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-volt">
                    <span>Kode Promo: <span className="font-bold">{promoParam}</span></span>
                    <span>- {(appliedDiscount * 100).toFixed(0)}%</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-cyan pt-2">
                  <span>Activation Fee</span>
                  <span className="line-through text-textMuted opacity-50">Rp 150.000</span>
                  <span className="font-bold">GRATIS</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-textMuted uppercase tracking-widest">Total Tagihan</span>
                  <span className="text-3xl font-display font-black text-volt glow-volt">
                    Rp {finalTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-volt animate-pulse">Memuat Secure Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
