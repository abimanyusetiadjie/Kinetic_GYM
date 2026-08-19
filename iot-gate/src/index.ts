/**
 * KINETIC Turnstile Gate Controller Daemon
 * Runs on Raspberry Pi 4 / Linux Compute Module
 * 
 * Flow:
 * 1. Listen for Serial / USB 2D Barcode Scanner stream.
 * 2. Send token to Supabase / Next.js API (/api/gate/verify).
 * 3. If online fails, fallback to OfflineGateCache.
 * 4. If GRANTED, trigger Solenoid Relay GPIO Pin for 4000ms.
 */

import { OfflineGateCache } from './offline-cache.js';

const API_ENDPOINT = process.env.KINETIC_API_ENDPOINT || 'http://localhost:3000/api/gate/verify';
const CLUB_ID = process.env.KINETIC_CLUB_ID || 'cl_sudirman_01';
const DEVICE_CODE = process.env.KINETIC_DEVICE_CODE || 'TRN-ENTRY-01';
const RELAY_GPIO_PIN = parseInt(process.env.RELAY_GPIO_PIN || '17', 10);

const offlineCache = new OfflineGateCache();

console.log(`[IoT Gate Daemon] Initializing Turnstile Controller: ${DEVICE_CODE}...`);
console.log(`[IoT Gate Daemon] Connected to Club: ${CLUB_ID} | GPIO Relay Pin: ${RELAY_GPIO_PIN}`);

// Simulated Relay Trigger Function
async function triggerSolenoidGateRelay(durationMs: number = 4000) {
  console.log(`⚡ [GPIO Relay] PIN ${RELAY_GPIO_PIN} HIGH -> SOLENOID UNLOCKED! Gate is OPEN.`);
  // In Linux Raspberry Pi production:
  // const Gpio = require('onoff').Gpio;
  // const relay = new Gpio(RELAY_GPIO_PIN, 'out');
  // relay.writeSync(1);
  
  await new Promise((resolve) => setTimeout(resolve, durationMs));
  
  // relay.writeSync(0);
  console.log(`🔒 [GPIO Relay] PIN ${RELAY_GPIO_PIN} LOW -> SOLENOID LOCKED. Gate CLOSED.`);
}

// Process QR Token scanned by hardware scanner
export async function handleScannedToken(rawQrToken: string) {
  console.log(`\n📥 [Scanner Input] Scanned QR Token: "${rawQrToken}"`);
  
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: rawQrToken,
        club_id: CLUB_ID,
        device_code: DEVICE_CODE,
      }),
    });

    const data: any = await res.json();

    if (data.status === 'GRANTED') {
      console.log(`✅ [Access Granted] Welcome ${data.userName || 'Member'}! Opening gate...`);
      await triggerSolenoidGateRelay(data.openDurationMs || 4000);
      return { success: true, status: 'GRANTED' };
    } else {
      console.log(`❌ [Access Denied] Reason: ${data.reason || 'Invalid QR Token'}`);
      return { success: false, status: 'DENIED' };
    }
  } catch (error) {
    console.warn(`⚠️ [Network Offline] API unreachable. Falling back to local offline cache...`);
    const isOfflineValid = offlineCache.verifyOffline(rawQrToken);
    
    if (isOfflineValid) {
      console.log(`✅ [Offline Access Granted] Valid member token in local cache. Opening gate...`);
      await triggerSolenoidGateRelay(4000);
      return { success: true, status: 'GRANTED_OFFLINE' };
    } else {
      console.log(`❌ [Offline Access Denied] Token not found in local cache.`);
      return { success: false, status: 'DENIED_OFFLINE' };
    }
  }
}

// Simulated heartbeat loop
setInterval(() => {
  // console.log(`💓 [Heartbeat] Gate ${DEVICE_CODE} is online and listening...`);
}, 30000);
