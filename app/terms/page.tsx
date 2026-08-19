import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-4 border-b border-border pb-8">
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-textPrimary">
          Syarat & Ketentuan Layanan
        </h1>
        <p className="text-sm font-mono text-cyan uppercase tracking-wider">
          Terakhir Diperbarui: 17 Agustus 2026
        </p>
      </div>

      <div className="prose prose-invert prose-p:text-textMuted prose-h2:text-volt prose-h2:font-display max-w-none">
        <h2>1. Penerimaan Syarat & Ketentuan</h2>
        <p>
          Dengan mengakses dan menggunakan platform digital KINETIC dan/atau mengunjungi cabang fisik KINETIC Gym, Anda secara otomatis menyetujui seluruh Syarat & Ketentuan ini. Jika Anda tidak setuju, harap jangan menggunakan layanan kami.
        </p>

        <h2>2. Keanggotaan & Dynamic QR Pass</h2>
        <p>
          Keanggotaan KINETIC bersifat pribadi dan tidak dapat dipindahtangankan. Dynamic QR Pass di dalam Member Portal adalah satu-satunya cara akses sah ke fasilitas gym. Pass ini akan di-refresh setiap 15 detik untuk mencegah kecurangan (anti-passback).
        </p>
        <p>
          Sistem kami dapat mendeteksi screenshot atau percobaan login di banyak perangkat secara bersamaan. Pelanggaran sistem dapat mengakibatkan penangguhan keanggotaan.
        </p>

        <h2>3. Pembayaran & Pengembalian Dana</h2>
        <p>
          Seluruh pembayaran bersifat final. Namun, KINETIC menyediakan "7-Day Cooling Off Period", di mana member baru berhak atas 100% refund jika mereka membatalkan keanggotaan dalam 7 hari pertama dan belum pernah check-in ke cabang mana pun.
        </p>

        <h2>4. Zero-Harassment & Tata Tertib Gym</h2>
        <p>
          KINETIC menerapkan kebijakan <strong>Strict Zero-Harassment</strong>. Dilarang keras melakukan intimidasi, merekam member lain tanpa izin (creeps), menjatuhkan alat berat tanpa kendali (ego lifting yang membahayakan), dan melakukan hard-selling (oleh PT maupun member lain). Pelanggaran akan berakibat pencabutan membership tanpa refund.
        </p>

        <h2>5. Layanan Personal Trainer (PT)</h2>
        <p>
          Booking Personal Trainer harus dilakukan melalui aplikasi/website KINETIC. Pembayaran sesi di luar sistem KINETIC tidak diakui dan kami tidak bertanggung jawab atas kerugian yang terjadi. Jika Anda merasa tidak cocok dengan Trainer, Anda dapat meminta pergantian Trainer tanpa biaya tambahan.
        </p>

        <h2>6. Kewajiban & Pelepasan Tanggung Jawab</h2>
        <p>
          Setiap kegiatan olahraga memiliki risiko cedera. Member bertanggung jawab penuh atas kesehatan dan kondisi fisiknya. KINETIC tidak bertanggung jawab atas cedera yang terjadi akibat kelalaian member atau kecelakaan di luar kendali manajemen.
        </p>
      </div>
    </div>
  );
}
