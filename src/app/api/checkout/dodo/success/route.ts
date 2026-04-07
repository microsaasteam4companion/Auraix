import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  // Dodo appends status=succeeded or status=active on success
  const isSuccess = status === 'succeeded' || status === 'active';

  if (!isSuccess) {
    console.warn(`[DODO_SUCCESS_WARN] Payment not successful. Status: ${status}`);
    return NextResponse.redirect(new URL('/dashboard/settings?upgrade=pending', req.url));
  }

  // We rely on our secure webhook (api/webhooks/dodo/route.ts) to actually perform the DB update.
  // We simply send the user back to the dashboard with a success parameter to update the UI.
  return NextResponse.redirect(new URL('/dashboard/settings?upgrade=success', req.url));
}
