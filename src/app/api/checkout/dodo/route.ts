import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { dodoClient } from '@/lib/dodopayments';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    // Manually pass userId in the redirect URL as Dodo preserves query params but doesn't support {checkout_session_id} placeholder
    const returnUrl = `${protocol}://${host}/api/checkout/dodo/success?userId=${userId}`;

    const checkoutSessionResponse = await dodoClient.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      metadata: { userId },
      return_url: returnUrl,
    });

    return NextResponse.json({
      url: checkoutSessionResponse.checkout_url,
      sessionId: checkoutSessionResponse.session_id
    });
  } catch (error: any) {
    console.error('[DODO_CHECKOUT_ERROR]', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
