# ⚡ KINETIC — Next-Gen Tech Fitness & Gym Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1.0-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **Gym Yang Nurut. Bukan Gym Yang Ribet.**  
> *50+ Cabang Nasional. Satu Dynamic QR Pass. 100% Digital Tanpa Formulir & Tanpa Biaya Pendaftaran.*

---

## 🌟 Key Highlights & Architecture

KINETIC adalah platform gym digital berkinerja tinggi yang dibangun untuk memberikan pengalaman kebugaran modern, cepat, dan transparan bagi puluhan ribu member di seluruh Indonesia.

### 📱 1. Mobile-First & PWA Experience
* **Native App Illusion:** Navigasi bilah bawah mengambang (*iOS/PWA style bottom navigation*) dengan tombol cepat *Dynamic Pass*.
* **PWA Quick Install:** Banner instalasi 1-klik yang ergonomis tanpa menghalangi menu sentuh.
* **100% Responsive:** Tampilan teroptimasi untuk semua ukuran layar (dari ponsel 360px hingga layar desktop 4K).

### 🌓 2. Dual-Theme Engine (Obsidian Dark & Titanium Lab Light)
* **Obsidian Mode:** Estetika atletik agresif dengan latar `#0A0D14`, aksen kuning Volt `#CAFF33`, dan cyan elektrik `#00E5FF`.
* **Titanium Lab Mode:** Estetika bersih laboratorium performa dengan latar `#F1F5F9` dan permukaan putih presisi.
* **Instant Toggle:** Pergantian tema animasi instan dengan persistensi `localStorage`.

### 🌐 3. Multi-Language System (ID / EN)
* Dukungan penuh dua bahasa (Bahasa Indonesia & International English) dengan copywriting berbobot *Aggressive Tech Athletic*.

### 🎟️ 4. Cinema-Style Studio Spot Picker
* Pemilih kursi matras studio interaktif (Row A Front-Row High Energy, Row B Balanced View, Row C Beginner-Friendly).
* Integrasi langsung **Google Calendar** & download file jadwal **iCal (.ics)** 1-klik.

### 📍 5. Radar Cabang GPS & Predictive Crowd Forecast
* Deteksi cabang terdekat otomatis berdasarkan koordinat GPS pengguna.
* Indikator kepadatan gym waktu nyata (*Live Crowd: Low / Moderate / Busy*) dengan grafik estimasi per jam serta integrasi rute Google Maps & Waze.

### 🛡️ 6. Member Portal & Dynamic 15-Second QR Pass
* Simulasi tiket turnstile QR TOTP otomatis berganti setiap 15 detik dengan indikator animasi pemindai laser.
* Telemetri latihan, pelacak streak kebugaran, dan manajemen pembatalan kelas.

### 👑 7. Personal Trainer Marketplace
* Roster pelatih elit tersertifikasi internasional (NASM / CSCS) dengan filter target fisik (*Hypertrophy, Fat Loss, Mobility, Combat*), bukti transformasi klien, dan tombol konsultasi langsung via WhatsApp.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Backend Integration:** [Supabase SSR](https://supabase.com/)
* **Type Safety:** [TypeScript](https://www.typescriptlang.org/) & [Zod](https://zod.dev/)

---

## 🚀 Quick Start (Menjalankan Secara Lokal)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/kinetic-gym-platform.git
cd kinetic-gym-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🗺️ Struktur Halaman & Rute Utama

```
app/
├── (Home)              # Landing page resmi dengan Hero, Fasilitas, dan Kalkulator Harga
├── /clubs              # 50 Cabang Nasional Explorer, Filter Kota, & Predictive Crowd AI
├── /classes            # Jadwal Kelas H+7 & Cinema-Style Studio Spot Picker
├── /trainers           # Elite Coach Roster & Konsultasi WhatsApp
├── /membership         # Paket Starter, Pro, Elite & Perbandingan Fitur
├── /checkout           # Multi-step Checkout dengan 3D Virtual Card & QRIS
├── /portal             # Member Dashboard & Dynamic 15-Second QR Access Pass
├── /onboarding         # Alur Aktivasi Biometrik Atlet Baru
├── /admin/             # Sci-Fi Command Center (Gate Simulator, POS, & Analytics)
```

---

## 📄 Lisensi
Proyek ini dibangun sebagai platform portofolio kebugaran berstandar industri komersial modern.
Hak Cipta © 2026 KINETIC TECH GYM. All rights reserved.
