import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'standardwebhooks';
import { updateUserProfile } from '@/lib/firestore';

const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error('[DODO_WEBHOOK_ERROR] DODO_PAYMENTS_WEBHOOK_SECRET is not configured.');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const headersList = await headers();
  const webhookHeaders = {
    'webhook-id': headersList.get('webhook-id') || '',
    'webhook-signature': headersList.get('webhook-signature') || '',
    'webhook-timestamp': headersList.get('webhook-timestamp') || '',
  };

  try {
    const rawBody = await req.text();
    const webhook = new Webhook(webhookSecret);
    
    // Verify the payload using the standardwebhooks specification
    webhook.verify(rawBody, webhookHeaders);
    
    const payload = JSON.parse(rawBody);
    console.log(`[DODO_WEBHOOK_RECEIVED] Event: ${payload.event_type}`);

    // Handle the payment success or subscription active events
    if (payload.event_type === 'payment.succeeded' || payload.event_type === 'subscription.active') {
      const { payment_id, subscription_id, metadata } = payload.data;
      const userId = metadata?.userId;

      if (userId) {
        // Upgrade the associated user to Pro
        await updateUserProfile(userId, {
          plan: 'pro',
          paymentId: payment_id || undefined,
          subscriptionId: subscription_id || undefined,
          planUpdatedAt: new Date()
        });
        console.log(`[DODO_WEBHOOK_SUCCESS] Upgraded user ${userId} to Pro plan.`);
      } else {
        console.warn(`[DODO_WEBHOOK_WARN] No userId found in payload metadata for ${payload.event_type}.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[DODO_WEBHOOK_VERIFICATION_FAILED]', error.message);
    return new NextResponse('Invalid webhook signature', { status: 401 });
  }
}
