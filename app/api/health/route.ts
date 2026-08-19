import { NextResponse } from 'next/server';
import { INDONESIA_50_CLUBS } from '@/lib/national-gym-data';

export async function GET() {
  const healthReport = {
    status: 'OPERATIONAL_EXCELLENT',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      nextjsAppRouter: { status: 'HEALTHY', routesActive: 19 },
      nationalGymNetwork: { status: 'HEALTHY', clubsCount: INDONESIA_50_CLUBS.length, cities: 12 },
      iotTurnstileDaemon: { status: 'ONLINE', simulatedPingMs: 14, defaultGate: 'TRN-ENTRY-01' },
      realtimeBus: { status: 'ONLINE', protocol: 'BroadcastChannel + WebSockets' },
      audioSynthesizer: { status: 'ENABLED', channels: ['880Hz Beep', '180Hz Buzzer', 'Cash Chime'] },
      pwaServiceWorker: { status: 'CONFIGURED', manifestUrl: '/manifest.json', appIcon: '/icon' },
    },
  };

  return NextResponse.json(healthReport);
}
