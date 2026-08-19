import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, guest_name, guest_phone } = body;

    if (!token || !guest_name) {
      return NextResponse.json(
        { success: false, error: 'Token and Guest Name are required' },
        { status: 400 }
      );
    }

    // Generate instant 1-Day Guest QR Pass
    const guestPassToken = 'KNT-GUEST-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    return NextResponse.json({
      success: true,
      message: '1-Day Guest Buddy Pass Berhasil Diaktifkan!',
      guestName: guest_name,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      dynamicQrToken: guestPassToken,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
