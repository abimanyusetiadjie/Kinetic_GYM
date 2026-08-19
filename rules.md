# Business, Operational & Technical Rules — Full-Stack TypeScript & Supabase

---

## 1. Aturan Keamanan & Akses Data Supabase (*Supabase & RLS Rules*)

### 1.1 Manajemen Kunci API (*Key Hierarchy & Least Privilege*)
1. **Public Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)**:
   - Hanya boleh digunakan di aplikasi browser Next.js dan aplikasi mobile React Native Expo.
   - **Wajib dilindungi oleh Row Level Security (RLS)**. Akses tanpa login hanya dapat membaca data publik (katalog cabang aktif, jadwal kelas, harga membership).
2. **Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)**:
   - **Dilarang keras dimasukkan ke dalam kode frontend client**.
   - Hanya boleh diakses di lingkungan server tertutup: **Supabase Edge Functions** dan **daemon Raspberry Pi (apps/iot-gate)**.
   - Digunakan untuk proses mutasi sensitif: aktivasi status langganan dari webhook pembayaran dan pembukaan gerbang turnstile darurat.

### 1.2 Aturan Row Level Security (RLS)
- Semua tabel baru yang dibuat di skema `public` **wajib mengeksekusi `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`**.
- Pengguna yang telah login (`authenticated`) hanya diizinkan membaca dan memperbarui baris data di mana `auth.uid() = user_id`.
- Data finansial (`payments`, `orders`) hanya memiliki izin `SELECT` bagi member, mutasi status hanya dapat dilakukan oleh database function atau service role.

---

## 2. Aturan Bisnis & Kebijakan Keanggotaan (*Membership Lifecycle*)

### 2.1 Tipe & Cakupan Akses Keanggotaan
1. **Single Club Membership**:
   - Member hanya berhak masuk ke 1 (satu) cabang *Home Club* yang dipilih saat pendaftaran.
   - Pintu *turnstile* di cabang lain akan otomatis menolak akses dengan notifikasi: `"Akses Cabang Tidak Sesuai"`.
   - Upgrade ke *All Club* dapat dilakukan kapan saja dengan membayar selisih biaya secara pro-rata.
2. **All Club Membership**:
   - Member berhak mengakses seluruh cabang gym di seluruh Indonesia tanpa batasan hari dan jam (selama jam operasional cabang).
3. **Day Pass (Tiket Harian)**:
   - Tiket berlaku 1x masuk (*single entry*) pada tanggal dan cabang yang ditentukan (berlaku 24 jam).

### 2.2 Siklus Penagihan & Auto-Renewal (*Dunning Management*)
- Penagihan berulang otomatis dieksekusi via Supabase Edge Function Cron Job setiap 30 hari.
- **Jadwal Percobaan Ulang Gagal Bayar**:
  - **Hari H (00:01 WIB)**: Percobaan pertama. Gagal $\rightarrow$ Status `PAST_DUE`. Notifikasi WhatsApp dikirim.
  - **Hari H+2 & H+4**: Percobaan ulang kedua dan ketiga.
  - **Hari H+7**: Status diubah menjadi `SUSPENDED`, akses turnstile gate dinonaktifkan.

### 2.3 Kebijakan Jeda Keanggotaan (*Membership Freeze Policy*)
- Kuota Gratis: Paket 3 Bulan (7 hari), Paket 6 Bulan (14 hari), Paket 12 Bulan (30 hari).
- Selama masa freeze, kartu akses / Dynamic QR member otomatis **TIDAK DAPAT** digunakan untuk check-in.
- Masa aktif keanggotaan diperpanjang otomatis di database sesuai total hari cuti yang diambil.

---

## 3. Aturan Pemesanan Kelas & Sistem Penalti (*Class Booking & Penalty System*)

### 3.1 Jendela Waktu Pemesanan & Kuota
- **Jendela Booking**: Dibuka tepat **48 jam sebelum kelas dimulai**, dan ditutup **15 menit sebelum kelas**.
- **Batas Booking Aktif**: Maksimal **2 kelas per hari** dan **5 booking aktif di masa depan**.
- **Eksekusi Atomik**: Seluruh pemesanan wajib memanggil RPC `public.book_class_atomic()` untuk menjamin ketiadaan *double booking* (*zero race-condition*).

### 3.2 Pembatalan & Sistem Strike
- **Pembatalan Bebas Penalti**: Maksimal **2 jam sebelum jadwal kelas**.
- **Late Cancellation / No-Show**: Mendapatkan **1 Strike**.
- **Sanksi 3 Strike (dalam 30 hari)**: Suspensi pemesanan kelas studio selama **7 hari kalender**. (Member tetap boleh datang latihan mandiri di area beban).

---

## 4. Aturan Akses IoT Gerbang Turnstile & Keamanan Fisik

1. **Dynamic QR Code (TOTP 15 Detik)**:
   - Token QR dihasilkan dari kombinasi terenkripsi `user_id + secret_seed + timestamp_window_15s`.
   - Tangkapan layar (*screenshot*) yang berumur > 30 detik ditolak gerbang.
2. **Anti-Passback Enforcement**:
   - Member yang telah tercatat `CHECK_IN` tidak dapat melakukan scan masuk kembali dalam rentang **30 menit** sebelum terdeteksi `CHECK_OUT`.
   - Deteksi *Impossible Travel*: Check-in di 2 cabang dengan jarak tak realistis dalam waktu singkat otomatis membekukan tiket akses sementara.

---

## 5. Standar Rekayasa Kode Full-Stack TypeScript

### 5.1 Standar Type Safety & Validasi Zod
- Seluruh DTO request dan response API **wajib divalidasi menggunakan Zod schema** di `@kinetic/validators`.
- Tipe data database diekspor langsung dari skema Supabase menggunakan perintah `supabase gen types typescript`.

```typescript
// Contoh Standar Zod Schema di @kinetic/validators
import { z } from 'zod';

export const BookClassSchema = z.object({
  scheduleId: z.string().uuid(),
  seatNumber: z.number().int().positive().optional(),
});

export type BookClassInput = z.infer<typeof BookClassSchema>;
```

### 5.2 Standar Edge Functions & Webhook Idempotency
- Endpoint Webhook Payment Gateway wajib:
  1. Memverifikasi **HMAC Signature** dari Midtrans/Xendit.
  2. Mengecek `idempotency_key` pada tabel `orders` agar tidak terjadi duplikasi aktivasi keanggotaan.
  3. Mengembalikan respon HTTP `200 OK` dalam waktu < 2.000 ms.
