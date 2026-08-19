import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, club_id, device_code } = body;

    if (!token || !club_id) {
      return NextResponse.json(
        { success: false, status: 'DENIED', reason: 'INVALID_PAYLOAD' },
        { status: 400 }
      );
    }

    // In production: Call Supabase RPC verify_dynamic_qr(token, club_id, device_code)
    // Check TOTP validity within 15s window, active membership, anti-passback rule
    const isValid = token.startsWith('KNT-') && token.includes('PASS');

    if (isValid) {
      return NextResponse.json({
        success: true,
        status: 'GRANTED',
        message: 'Akses Diberikan. Selamat Berlatih!',
        openDurationMs: 4000,
        userName: 'Budi Pratama',
      });
    }

    return NextResponse.json(
      {
        success: false,
        status: 'DENIED',
        reason: 'EXPIRED_OR_INVALID_QR',
        message: 'Tiket QR Kadaluarsa atau Tidak Sesuai.',
      },
      { status: 403 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, status: 'DENIED', error: error.message },
      { status: 500 }
    );
  }
}
