export interface WhatsAppMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  type: 'INVOICE_RECEIPT' | 'BUDDY_PASS_INVITE' | 'CLASS_REMINDER' | 'STRIKE_PENALTY';
  title: string;
  body: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export class WhatsAppNotificationService {
  private messageLog: WhatsAppMessage[] = [];

  constructor() {
    // Initial simulated messages
    this.messageLog = [
      {
        id: 'wa_001',
        recipientPhone: '081234567890',
        recipientName: 'Budi Pratama',
        type: 'INVOICE_RECEIPT',
        title: 'Struk Pembayaran KINETIC PRO ALL CLUB',
        body: 'Halo Budi Pratama! Pembayaran paket PRO ALL CLUB (3 Bulan) sebesar Rp 1.272.000 telah BERHASIL. Dynamic QR Pass Anda sudah aktif.',
        timestamp: '11:42 WIB',
        status: 'READ',
      },
      {
        id: 'wa_002',
        recipientPhone: '081987654321',
        recipientName: 'Dimas Anggoro (Teman)',
        type: 'BUDDY_PASS_INVITE',
        title: 'Undangan 1-Day Guest Pass dari Budi',
        body: 'Halo Dimas! Temanmu Budi Pratama membagikan 1-Day Free Pass KINETIC Sudirman SCBD untukmu. Klaim tiketmu di sini: https://kinetic.fit/pass/KNT-BUDDY-8291',
        timestamp: '11:45 WIB',
        status: 'DELIVERED',
      },
    ];
  }

  public getLogs(): WhatsAppMessage[] {
    return this.messageLog;
  }

  public sendInvoiceNotification(customerName: string, phone: string, orderId: string, amount: number, planName: string): WhatsAppMessage {
    const newMsg: WhatsAppMessage = {
      id: 'wa_' + Date.now(),
      recipientPhone: phone,
      recipientName: customerName,
      type: 'INVOICE_RECEIPT',
      title: `Struk Pembayaran #${orderId}`,
      body: `Halo ${customerName}! Terima kasih telah bergabung dengan KINETIC. Pembayaran ${planName} sebesar Rp ${amount.toLocaleString('id-ID')} telah terverifikasi otomatis. Dynamic QR Pass Anda siap digunakan.`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      status: 'SENT',
    };
    this.messageLog.unshift(newMsg);
    return newMsg;
  }

  public sendClassReminder(customerName: string, phone: string, className: string, spotLabel: string, timeStr: string): WhatsAppMessage {
    const newMsg: WhatsAppMessage = {
      id: 'wa_' + Date.now(),
      recipientPhone: phone,
      recipientName: customerName,
      type: 'CLASS_REMINDER',
      title: `Pengingat Kelas Studio (H-2 Jam)`,
      body: `Halo ${customerName}, kelas ${className} Anda di spot [${spotLabel}] akan dimulai pada ${timeStr} WIB di Studio 1 Sudirman SCBD. Batal gratis hingga 2 jam sebelum kelas.`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      status: 'SENT',
    };
    this.messageLog.unshift(newMsg);
    return newMsg;
  }
}

export const waService = new WhatsAppNotificationService();
