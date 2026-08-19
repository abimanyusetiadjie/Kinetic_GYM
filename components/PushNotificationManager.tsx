'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser Anda tidak mendukung push notification.');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const simulatePush = () => {
    if (permission === 'granted') {
      const title = 'Pengingat Kelas KINETIC';
      const options: NotificationOptions = {
        body: 'Kelas Les Mills BodyPump dimulai 30 menit lagi! Spot Anda: Mat A2 di Sudirman SCBD.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'class-reminder',
      };
      new Notification(title, options);
      // Play audio chime
      soundFx.playCashRegisterSound(); // We'll use cash register as a chime proxy, or any existing sound
    } else {
      alert('Anda harus mengizinkan notifikasi browser terlebih dahulu.');
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-display font-extrabold text-textPrimary flex items-center gap-2">
            <Bell className="w-4 h-4 text-volt" />
            <span>Notifikasi Pengingat Kelas (PWA)</span>
          </h3>
          <p className="text-xs text-textMuted font-mono mt-1">
            Terima pengingat kelas dan pembaruan antrean.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {permission === 'granted' ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
              AKTIF
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
              NONAKTIF
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="flex-1 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan transition-colors"
          >
            Aktifkan Notifikasi
          </button>
        )}
        <button
          onClick={simulatePush}
          className="flex-1 py-2.5 rounded-xl bg-volt/10 hover:bg-volt/20 border border-volt/30 text-xs font-mono text-volt transition-colors flex items-center justify-center gap-2"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Tes Push Notifikasi H-30mnt</span>
        </button>
      </div>
    </div>
  );
}
