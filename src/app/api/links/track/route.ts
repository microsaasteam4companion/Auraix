import { NextRequest, NextResponse } from "next/server";
import { recordLinkClick } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  const linkId = searchParams.get("linkId");
  const url = searchParams.get("url");

  if (!pageId || !linkId || !url) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // Record the click
    await recordLinkClick(pageId, linkId);
  } catch (error) {
    console.error("Failed to record click:", error);
    // Don't block the redirect even if tracking fails
  }

  // Redirect to the target URL
  return NextResponse.redirect(url);
}
