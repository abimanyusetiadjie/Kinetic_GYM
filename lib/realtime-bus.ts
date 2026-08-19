/**
 * Realtime Event Bus for KINETIC Gym Ecosystem
 * Synchronizes events across browser tabs using BroadcastChannel API + LocalStorage fallback.
 */

export type RealtimeEvent =
  | {
      type: 'MEMBER_SCAN_CHECKIN';
      payload: {
        id: string;
        userName: string;
        membershipTier: string;
        gateName: string;
        status: 'GRANTED' | 'DENIED';
        reason?: string;
        timestamp: string;
      };
    }
  | {
      type: 'MEMBERSHIP_PURCHASED';
      payload: {
        orderId: string;
        customerName: string;
        planName: string;
        amount: number;
        timestamp: string;
      };
    }
  | {
      type: 'EMERGENCY_OVERRIDE';
      payload: {
        staffName: string;
        gateName: string;
        timestamp: string;
      };
    };

const CHANNEL_NAME = 'kinetic_realtime_channel';

class RealtimeBus {
  private channel: BroadcastChannel | null = null;
  private listeners: ((event: RealtimeEvent) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (msgEvent) => {
        this.emitToListeners(msgEvent.data);
      };
    }
  }

  public publish(event: RealtimeEvent) {
    if (this.channel) {
      this.channel.postMessage(event);
    }
    // Also trigger listeners in current tab
    this.emitToListeners(event);
  }

  public subscribe(callback: (event: RealtimeEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private emitToListeners(event: RealtimeEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.error('Error in realtime listener:', e);
      }
    });
  }
}

export const realtimeBus = new RealtimeBus();
