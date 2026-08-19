# KINETIC Turnstile IoT Gate Controller Daemon

Daemon pengontrol gerbang turnstile otomatis untuk dipasang di komputer mini **Raspberry Pi 4 / Raspberry Pi Compute Module** di setiap cabang gym fisik KINETIC.

---

## 🛠️ Diagram Wiring Perangkat Keras

```
+-------------------+           +-------------------------+
| 2D Barcode Scanner| --(USB)-->| Raspberry Pi 4 (Linux)  |
+-------------------+           |                         |
                                | GPIO Pin 17 (Signal)    | ----> +-------------------+
                                | 5V VCC & GND            |       | 5V Relay Solenoid | ----> [ Pintu Turnstile ]
                                +-------------------------+       +-------------------+       [ Terbuka 4 Detik ]
```

---

## 🚀 Cara Menjalankan di Raspberry Pi Cabang

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Build TypeScript**:
   ```bash
   npm run build
   ```
3. **Jalankan Daemon**:
   ```bash
   npm start
   ```

---

## 🔒 Fitur Keamanan:
- **Respon Cepat (< 200 ms)**: Token diverifikasi seketika via API Next.js / Supabase.
- **Offline Resilience**: Jika koneksi internet cabang terputus, daemon otomatis memvalidasi token dari *Offline Cache* lokal.
- **Auto Gate Lock (4 Detik)**: Relay otomatis memutus arus solenoid setelah 4 detik untuk mencegah *tailgating*.
