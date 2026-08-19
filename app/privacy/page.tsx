import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-4 border-b border-border pb-8">
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-textPrimary">
          Kebijakan Privasi
        </h1>
        <p className="text-sm font-mono text-cyan uppercase tracking-wider">
          Terakhir Diperbarui: 17 Agustus 2026
        </p>
      </div>

      <div className="prose prose-invert prose-p:text-textMuted prose-h2:text-volt prose-h2:font-display max-w-none">
        <h2>1. Kepatuhan Undang-Undang PDP</h2>
        <p>
          KINETIC tunduk sepenuhnya pada <strong>Undang-Undang Pelindungan Data Pribadi (UU PDP) Tahun 2022</strong>. Kami berkomitmen melindungi data pribadi Anda dari penyalahgunaan dan kebocoran.
        </p>

        <h2>2. Data yang Kami Kumpulkan</h2>
        <p>
          Kami hanya mengumpulkan informasi esensial yang diperlukan untuk memberikan layanan keanggotaan gym, antara lain:
        </p>
        <ul>
          <li>Data Identitas (Nama lengkap, NIK/KTP untuk verifikasi umur)</li>
          <li>Data Kontak (Nomor WhatsApp, Email)</li>
          <li>Data Transaksi (Riwayat pembelian paket, booking kelas)</li>
          <li>Data Akses (Log check-in di gerbang gym menggunakan QR Pass)</li>
        </ul>

        <h2>3. Penggunaan Data</h2>
        <p>
          Data Anda digunakan semata-mata untuk: memproses pendaftaran, memverifikasi akses gym, mengirim notifikasi transaksional (seperti OTP atau bukti pembayaran), dan keperluan analitik internal untuk mencegah kepadatan gym. Kami <strong>TIDAK PERNAH</strong> menjual atau menyewakan data Anda kepada pihak ketiga untuk tujuan marketing spam.
        </p>

        <h2>4. Keamanan Data & PCI-DSS</h2>
        <p>
          Pembayaran Anda diproses oleh payment gateway berlisensi Bank Indonesia dan bersertifikat <strong>PCI-DSS Tier 1</strong>. KINETIC tidak pernah menyimpan nomor kartu kredit atau PIN Anda di server kami. Semua lalu lintas data dienkripsi dengan standar industri AES-256.
        </p>

        <h2>5. Hak Subjek Data</h2>
        <p>
          Sesuai UU PDP, Anda memiliki hak penuh untuk: meminta salinan data Anda, mengoreksi data yang salah, membatasi pemrosesan, dan menghapus permanen akun beserta data Anda ("Right to be Forgotten") jika Anda berhenti berlangganan.
        </p>

        <h2>6. Kontak DPO (Data Protection Officer)</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang privasi, silakan hubungi tim DPO kami di <a href="mailto:privacy@kinetic.id" className="text-cyan hover:underline">privacy@kinetic.id</a>.
        </p>
      </div>
    </div>
  );
}
