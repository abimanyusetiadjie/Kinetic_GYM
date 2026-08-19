# System Architecture & Technical Specification — Full-Stack TypeScript & Supabase

---

## 1. System Overview & Arsitektur Monorepo

Platform dirancang menggunakan arsitektur **Full-Stack TypeScript Monorepo (Turborepo)** dengan **Supabase** sebagai fondasi *Backend-as-a-Service (BaaS)* dan *Database Engine*. Arsitektur ini memaksimalkan kecepatan rilis, konsistensi tipe data (*End-to-End Type Safety*), dan keamanan multi-cabang dengan *Row Level Security (RLS)*.

```mermaid
graph TB
    subgraph Client Layer [Full TypeScript Client Layer]
        Web[apps/web: Next.js 15 App Router - Public & Member PWA]
        Mobile[apps/mobile: React Native Expo - Member iOS & Android]
        Admin[apps/admin: Next.js 15 - Staff POS & Branch Manager]
    end

    subgraph Shared TypeScript Packages [Turborepo Workspace]
        Types["@kinetic/types (Database & DTO Types)"]
        Validators["@kinetic/validators (Zod Schemas)"]
        UI["@kinetic/ui (Shared Component Tokens)"]
    end

    subgraph Supabase Ecosystem [Cloud Backend & Data Platform]
        SupabaseAuth[Supabase Auth - WhatsApp OTP / OAuth / JWT]
        RLS[PostgreSQL 16 Engine + Row Level Security - RLS]
        Realtime[Supabase Realtime - WebSocket Engine]
        Storage[Supabase Storage - S3 Media & Invoices]
        EdgeFunctions[Supabase Edge Functions - Deno/TypeScript]
        RPC[PostgreSQL Stored Procedures - Atomic Booking]
    end

    subgraph IoT & Edge Infrastructure
        EdgeGateway[apps/iot-gate: Node.js TS di Raspberry Pi 4]
        Turnstile[Turnstile Gate Relay & 2D QR Barcode Scanner]
    end

    subgraph External Payment & Messaging
        PG[Payment Gateway - Midtrans / Xendit]
        WAGateway[WhatsApp Business API - Notification Service]
    end

    Client Layer -.-> Shared TypeScript Packages
    EdgeGateway -.-> Shared TypeScript Packages

    Web & Mobile & Admin -->|Supabase JS Client + RLS| RLS
    Web & Mobile & Admin -->|Auth SDK| SupabaseAuth
    Web & Mobile & Admin -->|WebSocket Subscriptions| Realtime
    Web & Mobile -->|File Uploads| Storage

    EdgeFunctions --> PG
    EdgeFunctions --> WAGateway
    PG -->|Webhook HTTP POST| EdgeFunctions
    EdgeFunctions -->|Service Role Client| RLS

    EdgeGateway <== Realtime WebSocket / REST ==> EdgeFunctions
    EdgeGateway --> Turnstile
```

---

## 2. Pilihan Tech Stack Lengkap (Full-Stack TypeScript)

| Komponen | Teknologi | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Monorepo Manager** | **Turborepo + pnpm** | Mengelola multi-aplikasi (Web, Mobile, Admin, IoT) dengan build cache secepat kilat dan *shared packages*. |
| **Database & Auth** | **Supabase (PostgreSQL 16 + Supabase Auth)** | Manajemen user, enkripsi kata sandi, login via OTP WhatsApp / Google, serta performa PostgreSQL kelas enterprise. |
| **Authorization Layer** | **PostgreSQL Row Level Security (RLS)** | Keamanan data di level baris tabel langsung dari database. Member hanya bisa melihat datanya sendiri tanpa celah bypass API. |
| **Realtime Subscriptions** | **Supabase Realtime (WebSockets)** | Siaran langsung *Live Crowd Density*, notifikasi giliran *Waitlist*, dan log gate turnstile secara instan. |
| **Serverless Backend** | **Supabase Edge Functions (Deno / TypeScript)** | Menangani webhook payment gateway, regenerasi TOTP QR verification, dan cron job auto-renewal / dunning. |
| **Public & Member Web** | **Next.js 15 (React 19, TypeScript, Tailwind)** | Server-Side Rendering (SSR) untuk SEO halaman cabang/kelas dan Client-Side PWA untuk Member Portal. |
| **Mobile App (iOS & Android)** | **React Native (Expo SDK 52+, TypeScript)** | Satu codebase untuk iOS dan Android. Dilengkapi `expo-brightness` dan `react-native-reanimated` untuk Dynamic QR Pass. |
| **Staff & Admin POS** | **Next.js 15 (React + TypeScript + Tailwind)** | Dashboard kasir cabang, pendaftaran walk-in, monitor gerbang turnstile real-time, dan analitik pendapatan. |
| **IoT Gate Controller** | **Node.js 22 + TypeScript (Raspberry Pi)** | Membaca port serial scanner 2D dan memicu pin GPIO relay solenoid turnstile dalam < 200 ms. |
| **Object Storage** | **Supabase Storage** | Bucket terenkripsi untuk foto profil member, sertifikat pelatih, galeri cabang, dan PDF invoice. |

---

## 3. Alur Komunikasi Sistem & Sequence Diagrams

### 3.1 Alur Verifikasi Dynamic QR Turnstile Gate (Realtime + Edge Function)

```mermaid
sequenceDiagram
    autonumber
    actor Member as Member App (React Native)
    participant Scanner as 2D QR Scanner (Gerbang)
    participant RPi as Raspberry Pi (apps/iot-gate)
    participant Edge as Supabase Edge Function (/verify-qr)
    participant DB as PostgreSQL (Supabase)
    participant Turnstile as Solenoid Relay Gerbang

    Member->>Member: Generate TOTP QR Token (15s Window)
    Member->>Scanner: Pindai Layar HP ke Scanner
    Scanner->>RPi: Raw String Token via USB/Serial
    RPi->>Edge: POST /verify-qr (club_id, device_code, token) [Header: Service-Key]
    Edge->>DB: CALL verify_dynamic_qr(p_token, p_club_id, p_device_code)
    alt Token Valid & Membership Active
        DB-->>Edge: Return { status: 'GRANTED', user_id: 'uuid', user_name: 'Budi' }
        Edge-->>RPi: 200 OK (Access Granted)
        RPi->>Turnstile: Trigger GPIO Pin HIGH (Open Gate 4000ms)
        Turnstile-->>Member: Lampu Hijau + Pintu Terbuka
        DB->>DB: INSERT INTO checkin_logs (status: 'GRANTED')
    else Token Expired / Double Tap / Wrong Club
        DB-->>Edge: Return { status: 'DENIED', reason: 'ANTI_PASSBACK' }
        Edge-->>RPi: 403 Forbidden (Access Denied)
        RPi-->>Member: Buzzer Bunyi + Lampu Merah
        DB->>DB: INSERT INTO checkin_logs (status: 'DENIED')
    end
```

### 3.2 Alur Concurrency Booking Kelas Studio (Atomic PostgreSQL Function / RPC)

```mermaid
sequenceDiagram
    autonumber
    actor Member as Member (Next.js / Expo)
    participant Client as Supabase Client (RLS)
    participant RPC as PostgreSQL RPC: book_class_atomic()
    participant Table as class_schedules & class_bookings
    participant Realtime as Supabase Realtime Engine

    Member->>Client: supabase.rpc('book_class_atomic', { schedule_id: 'sch_123' })
    Client->>RPC: Eksekusi Fungsi dengan Row Lock (FOR UPDATE)
    RPC->>Table: SELECT booked_count, max_capacity FROM class_schedules FOR UPDATE
    alt Kuota Masih Ada (booked_count < max_capacity)
        RPC->>Table: INSERT INTO class_bookings (status: 'CONFIRMED')
        RPC->>Table: UPDATE class_schedules SET booked_count = booked_count + 1
        RPC-->>Client: 200 OK (Booking Berhasil)
        Table->>Realtime: Broadcast 'UPDATE' on class_schedules (Sisa Kuota Baru)
        Realtime-->>Member: Update UI Kuota Seketika di Semua Layar
    else Kuota Penuh
        RPC-->>Client: 409 Conflict (Penuh! Masuk ke Antrean Waitlist?)
    end
```

### 3.3 Alur Pembayaran & Webhook Auto-Activation (Supabase Edge Functions)

```mermaid
sequenceDiagram
    autonumber
    actor Member as Pembeli
    participant App as Checkout UI (Next.js)
    participant EdgeFunc as Supabase Edge Function (/create-order)
    participant PG as Midtrans / Xendit Gateway
    participant WebhookFunc as Supabase Edge Function (/payment-webhook)
    participant DB as PostgreSQL (Supabase DB)
    participant WA as WhatsApp API Worker

    Member->>App: Pilih Paket & Klik Bayar
    App->>EdgeFunc: POST /create-order (plan_id, payment_method)
    EdgeFunc->>PG: Buat Snap/Invoice Charge
    PG-->>EdgeFunc: Return QRIS String / Nomor VA / Payment URL
    EdgeFunc->>DB: INSERT INTO orders & payments (status: 'PENDING')
    EdgeFunc-->>App: Tampilkan Instruksi Pembayaran
    Member->>PG: Melakukan Transfer Bank / Scan QRIS
    PG->>WebhookFunc: HTTP POST /payment-webhook (Signature HMAC Verified)
    WebhookFunc->>DB: UPDATE payments SET status = 'SUCCESS'
    WebhookFunc->>DB: INSERT INTO user_memberships (status: 'ACTIVE')
    WebhookFunc->>WA: Kirim Notifikasi WhatsApp (Invoice & Link QR Pass)
    WebhookFunc-->>PG: 200 OK
```

---

## 4. Keamanan & Skalabilitas Berbasis Supabase

1. **Row Level Security (RLS)**:
   - Kebijakan RLS memastikan member tidak dapat memanipulasi data member lain meskipun memanggil REST API Supabase secara langsung.
   - Peran Staf (*Club Staff*) hanya dapat membaca data yang terikat dengan `home_club_id` cabang tempat mereka bertugas.
2. **Database Functions (RPC) & Atomisitas**:
   - Logika kritis seperti pemotongan kuota kelas dan antrean *waitlist* dijalankan langsung di dalam database menggunakan transaksi `PL/pgSQL` dengan penguncian baris `SELECT FOR UPDATE` untuk mencegah *race condition*.
3. **Penyimpanan Kunci API (*Key Management*)**:
   - `anon_key` (Public): Digunakan di frontend Next.js dan React Native (terlindungi oleh RLS).
   - `service_role_key` (Secret): Hanya digunakan di lingkungan aman Supabase Edge Functions dan daemon Raspberry Pi IoT.
