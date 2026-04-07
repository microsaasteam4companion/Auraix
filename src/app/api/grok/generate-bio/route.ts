import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { handle, platform, tone } = await req.json();

    if (!handle || !platform || !tone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const prompt = `Generate a short, compelling bio (max 200 characters) for a ${platform} user with the handle "${handle}". 
The tone should be ${tone}. 
Write it as if they are describing themselves in a link-in-bio page.
Only return the bio text, nothing else. No quotes, no explanation.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative bio writer. You write short, punchy bios for social media link-in-bio pages. Keep it under 200 characters.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Grok API error:", errText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const bio = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ bio });
  } catch (error) {
    console.error("Bio generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
