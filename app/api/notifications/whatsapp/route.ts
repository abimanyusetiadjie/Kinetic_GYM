import { NextRequest, NextResponse } from 'next/server';
import { waService } from '@/lib/whatsapp-service';

export async function GET() {
  const logs = waService.getLogs();
  return NextResponse.json({ success: true, count: logs.length, logs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, type, orderId, amount, planName } = body;

    let newMsg;
    if (type === 'INVOICE_RECEIPT') {
      newMsg = waService.sendInvoiceNotification(customerName, phone, orderId, amount, planName);
    } else {
      newMsg = waService.sendClassReminder(customerName, phone, 'Les Mills BodyPump', 'Mat A2', '18:30');
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp notification dispatched successfully.',
      data: newMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
