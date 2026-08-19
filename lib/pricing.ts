export function getPlanPrices(
  tier: 'SINGLE' | 'ALL',
  duration: number,
  appliedDiscount: number,
  baseSingle: number,
  baseAll: number
) {
  let base = tier === 'SINGLE' ? baseSingle : baseAll;
  let durDiscount = 0;
  
  if (duration === 3) durDiscount = 0.15;
  if (duration === 6) durDiscount = 0.25;
  if (duration === 12) durDiscount = 0.40;

  let perMonth = Math.round(base * (1 - durDiscount));
  let subtotal = perMonth * duration;
  let finalTotal = Math.round(subtotal * (1 - appliedDiscount));

  return { 
    perMonth, 
    subtotal, 
    finalTotal, 
    durDiscount: durDiscount * 100 
  };
}

export function validatePromoCode(code: string): { discount: number; message: string; success: boolean } {
  const c = code.trim().toUpperCase();
  if (!c) {
    return { discount: 0, message: '', success: false };
  }
  if (c === 'KINETIC20') {
    return { discount: 0.20, message: '🎉 Kode KINETIC20 Berhasil: Diskon 20% Diterapkan!', success: true };
  }
  if (c === 'STREAK10') {
    return { discount: 0.10, message: '🔥 Diskon Konsistensi Streak 10% Diterapkan!', success: true };
  }
  return { discount: 0, message: '❌ Kode promo tidak valid atau telah kedaluwarsa.', success: false };
}
