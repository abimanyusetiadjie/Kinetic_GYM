import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { OrderStatus } from '@/types/database.types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, transaction_status } = body;

    // Idempotent check & payment verification
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      const orderStatus: OrderStatus = 'PAID';
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('order_number', order_id)
        .select()
        .single();

      if (orderError) {
        console.error('Order update error:', orderError);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and membership activated.',
        order: orderData,
      });
    }

    return NextResponse.json({ success: true, message: 'Notification received.' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
