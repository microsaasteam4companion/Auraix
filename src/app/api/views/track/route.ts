import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const { pageId, device, referrer } = await req.json();

    if (!pageId) {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    await recordPageView(pageId, device || "desktop", referrer || "direct");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
