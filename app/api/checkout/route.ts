import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, you would initialize the Xendit SDK here:
    // const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
    // const response = await xenditClient.Invoice.createInvoice({ ...body })
    
    // Untuk saat ini, kita mock respons dari Xendit Payment Gateway
    // untuk keperluan testing dan demo UI
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

    const mockXenditResponse = {
      id: `inv_${Date.now()}`,
      external_id: body.orderId,
      status: 'PENDING',
      merchant_name: 'KINETIC Gym',
      amount: body.amount,
      payer_email: body.customerEmail || 'member@kinetic.id',
      description: `Pembayaran Membership: ${body.planName}`,
      // Mengarahkan ke halaman Xendit dummy
      invoice_url: `https://checkout-staging.xendit.co/web/${Date.now()}`,
      expiry_date: new Date(Date.now() + 86400000).toISOString(),
    };

    return NextResponse.json(mockXenditResponse);
  } catch (error) {
    console.error('Xendit Error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat transaksi Xendit' },
      { status: 500 }
    );
  }
}
