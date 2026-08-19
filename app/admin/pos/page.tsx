'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  DollarSign,
  Send,
  CheckCircle2,
  Terminal,
  Printer,
  UserPlus,
  Cpu
} from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';
import { realtimeBus } from '@/lib/realtime-bus';
import { motion, AnimatePresence } from 'framer-motion';

export default function POSPage() {
  const [selectedProduct, setSelectedProduct] = useState<'DAY_PASS' | 'STARTER_1M' | 'PRO_3M'>('DAY_PASS');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentType, setPaymentType] = useState<'QRIS' | 'EDC' | 'CASH'>('QRIS');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);

  const productPrices = {
    DAY_PASS: 85000,
    STARTER_1M: 399000,
    PRO_3M: 1272000,
  };

  const productNames = {
    DAY_PASS: 'DAY PASS (1-DAY ACCESS)',
    STARTER_1M: 'STARTER (1-MONTH PASS)',
    PRO_3M: 'PRO ALL-CLUB (3-MONTH PASS)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const invoiceData = {
      orderId: 'KNT-POS-' + Date.now().toString().slice(-6),
      productName: productNames[selectedProduct],
      amount: productPrices[selectedProduct],
      customerName: fullName,
      customerPhone: phone,
      paymentMethod: paymentType,
      date: new Date().toLocaleTimeString('id-ID'),
    };

    setLastInvoice(invoiceData);
    setIsSuccess(true);
    soundFx.playCashRegisterSound();

    // Broadcast event to Member Portal & Gate
    realtimeBus.publish({
      type: 'MEMBERSHIP_PURCHASED',
      payload: {
        orderId: invoiceData.orderId,
        customerName: fullName,
        planName: productNames[selectedProduct],
        amount: invoiceData.amount,
        timestamp: invoiceData.date,
      },
    });
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setIsSuccess(false);
    setLastInvoice(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 font-mono text-white">
      
      {/* Header */}
      <div className="border-b border-cyan/20 pb-6 flex items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyan/10 border border-cyan/30 text-[10px] text-cyan uppercase tracking-[0.2em] mb-4">
            <CreditCard className="w-3 h-3" /> POS_TERMINAL_ACTIVATE
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">
            WALK-IN <span className="text-cyan">TRANSACTIONS.</span>
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          /* Invoice Print State */
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-8 sm:p-12 bg-black border border-volt space-y-8 max-w-2xl mx-auto shadow-[0_0_50px_rgba(202,255,51,0.15)] relative overflow-hidden"
          >
            {/* Holographic lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(202,255,51,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-volt/10 text-volt border border-volt/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(202,255,51,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-black text-white tracking-tighter uppercase">
                TRANSACTION SECURED.
              </h2>
              <div className="inline-block px-4 py-1.5 bg-volt/10 text-volt text-xs font-mono uppercase tracking-[0.2em] border border-volt/30">
                TX_ID: {lastInvoice?.orderId}
              </div>
            </div>

            {/* Receipt Tape */}
            <div className="relative z-10 p-6 bg-white text-black font-mono text-xs space-y-3 uppercase tracking-wider font-bold">
              <div className="text-center border-b-2 border-black border-dashed pb-4 mb-4 text-xl tracking-tighter">
                KINETIC RECIEPT
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">TARGET_SUBJECT:</span>
                <span>{lastInvoice?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">COMMS_LINK:</span>
                <span>{lastInvoice?.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">ACQUIRED_ASSET:</span>
                <span className="text-right w-1/2">{lastInvoice?.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">FUNDS_TRANSFER:</span>
                <span>{lastInvoice?.paymentMethod}</span>
              </div>
              <div className="pt-4 mt-2 border-t-2 border-black border-dashed flex justify-between text-base">
                <span>TOTAL_DEDUCTION:</span>
                <span>Rp {lastInvoice?.amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="relative z-10 space-y-4 pt-4">
              <button
                onClick={() => {
                  const text = `KINETIC PROTOCOL: TRANSACTION SECURED. TX_ID: ${lastInvoice?.orderId}. ASSET: ${lastInvoice?.productName}. DEDUCTION: Rp ${lastInvoice?.amount.toLocaleString('id-ID')}. YOUR DYNAMIC PASS IS NOW ACTIVE.`;
                  window.open(`https://wa.me/${lastInvoice?.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full py-4 bg-[#25D366]/20 text-[#25D366] border border-[#25D366] font-display font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#25D366] hover:text-black transition-colors uppercase"
              >
                <Send className="w-5 h-5" />
                TRANSMIT INVOICE VIA WHATSAPP
              </button>

              <button
                onClick={handleReset}
                className="w-full py-4 bg-transparent border border-white/30 text-white/70 font-mono text-xs uppercase tracking-widest hover:text-white hover:border-white transition-colors"
              >
                INITIALIZE NEW TRANSACTION
              </button>
            </div>
          </motion.div>
        ) : (
          /* POS Form */
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            
            {/* Left Col: Asset Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2 border-b border-cyan/20 pb-2">
                <Terminal className="w-3 h-3" /> STEP 1: SELECT ASSET PARAMETERS
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {(Object.keys(productPrices) as Array<keyof typeof productPrices>).map((prod) => (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-5 text-left border transition-all relative overflow-hidden group ${
                      selectedProduct === prod 
                        ? 'bg-cyan/10 border-cyan text-cyan shadow-[inset_0_0_20px_rgba(0,229,255,0.1)]' 
                        : 'bg-black border-white/10 text-white/50 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-widest mb-4 h-10">{productNames[prod]}</div>
                    <div className="text-xl font-display font-black tracking-tighter">
                      Rp {productPrices[prod].toLocaleString('id-ID')}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2 border-b border-cyan/20 pb-2 pt-6">
                <Cpu className="w-3 h-3" /> STEP 2: INPUT TARGET DATA
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest">Full Designation</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black border border-white/20 p-3 text-white text-xs tracking-wider focus:outline-none focus:border-cyan transition-colors uppercase placeholder:text-white/20"
                    placeholder="TARGET NAME"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest">Comms Link (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-white/20 p-3 text-white text-xs tracking-wider focus:outline-none focus:border-cyan transition-colors uppercase placeholder:text-white/20"
                    placeholder="08XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Payment & Checkout */}
            <div className="bg-black border border-cyan/30 p-6 space-y-6 relative">
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan opacity-50"></div>

              <div className="text-[10px] text-cyan uppercase tracking-[0.2em] flex items-center gap-2 border-b border-cyan/20 pb-2">
                <DollarSign className="w-3 h-3" /> STEP 3: FUNDS TRANSFER
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['QRIS', 'EDC', 'CASH'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentType(method as any)}
                    className={`py-3 text-xs uppercase tracking-widest border transition-all ${
                      paymentType === method 
                        ? 'bg-cyan text-black border-cyan font-bold' 
                        : 'bg-transparent text-white/50 border-white/20 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-white/50 tracking-widest">
                  <span>SUBTOTAL</span>
                  <span>Rp {productPrices[selectedProduct].toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50 tracking-widest">
                  <span>TAX (11%)</span>
                  <span>INCLUDED</span>
                </div>
                <div className="flex justify-between text-xl font-display font-black text-cyan pt-2">
                  <span>TOTAL</span>
                  <span>Rp {productPrices[selectedProduct].toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 mt-4 bg-cyan text-black font-display font-black text-sm tracking-widest flex items-center justify-center gap-3 uppercase hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                <Printer className="w-5 h-5" /> EXECUTE TRANSACTION
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
