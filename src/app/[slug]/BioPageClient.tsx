"use client";

import { useEffect } from "react";
import type { BioPage } from "@/types";
import { getDeviceType, getReferrer } from "@/lib/utils";
import { ExternalLink, Zap, Globe, Mail, MessageCircle, PlayCircle, Star, Phone, MapPin, Share2, Sparkles } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";

const THEME_STYLES: Record<string, {
  bg: string;
  text: string;
  muted: string;
  linkBg: string;
  linkText: string;
  linkBorder: string;
  linkHoverBg: string;
}> = {
  light: {
    bg: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    linkBg: "#F3F4F6",
    linkText: "#111827",
    linkBorder: "1px solid #E5E7EB",
    linkHoverBg: "#E5E7EB",
  },
  dark: {
    bg: "#111827",
    text: "#F9FAFB",
    muted: "#9CA3AF",
    linkBg: "#1F2937",
    linkText: "#F3F4F6",
    linkBorder: "1px solid #374151",
    linkHoverBg: "#374151",
  },
  minimal: {
    bg: "#FAFAFA",
    text: "#374151",
    muted: "#6B7280",
    linkBg: "transparent",
    linkText: "#374151",
    linkBorder: "1px solid #D1D5DB",
    linkHoverBg: "#F3F4F6",
  },
  soft: {
    bg: "#FFF7ED",
    text: "#7C2D12",
    muted: "#A16207",
    linkBg: "#FED7AA",
    linkText: "#7C2D12",
    linkBorder: "1px solid #FDBA74",
    linkHoverBg: "#FDBA74",
  },
  classic: {
    bg: "#F8FAFC",
    text: "#1E293B",
    muted: "#64748B",
    linkBg: "#1E293B",
    linkText: "#F8FAFC",
    linkBorder: "none",
    linkHoverBg: "#334155",
  },
  basics: {
    bg: "#FFFFFF",
    text: "#000000",
    muted: "#737373",
    linkBg: "#FFFFFF",
    linkText: "#000000",
    linkBorder: "1px solid #E5E5E5",
    linkHoverBg: "#FAFAFA",
  },
  carbon: {
    bg: "#0A0A0A",
    text: "#FAFAFA",
    muted: "#737373",
    linkBg: "#171717",
    linkText: "#FAFAFA",
    linkBorder: "1px solid #262626",
    linkHoverBg: "#262626",
  },
  christmas: {
    bg: "#064E3B",
    text: "#FFFFFF",
    muted: "#D1FAE5",
    linkBg: "#065F46",
    linkText: "#FFFFFF",
    linkBorder: "1px solid #059669",
    linkHoverBg: "#047857",
  },
  pride: {
    bg: "linear-gradient(180deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.8)",
    linkBg: "rgba(255,255,255,0.1)",
    linkText: "#FFFFFF",
    linkBorder: "1px solid rgba(255,255,255,0.2)",
    linkHoverBg: "rgba(255,255,255,0.2)",
  },
  winter: {
    bg: "linear-gradient(180deg, #E0F2FE, #7DD3FC)",
    text: "#0C4A6E",
    muted: "#0369A1",
    linkBg: "rgba(255,255,255,0.4)",
    linkText: "#0C4A6E",
    linkBorder: "1px solid rgba(255,255,255,0.6)",
    linkHoverBg: "rgba(255,255,255,0.6)",
  },
  glassy: {
    bg: "linear-gradient(135deg, #FDF2F8, #FFE4E6)",
    text: "#881337",
    muted: "#BE123C",
    linkBg: "rgba(255,255,255,0.3)",
    linkText: "#881337",
    linkBorder: "1px solid rgba(255,255,255,0.6)",
    linkHoverBg: "rgba(255,255,255,0.5)",
  },
  neon: {
    bg: "#0F172A",
    text: "#F1F5F9",
    muted: "#94A3B8",
    linkBg: "#1E293B",
    linkText: "#F1F5F9",
    linkBorder: "1px solid #7C3AED",
    linkHoverBg: "#1E293B",
  },
  rainynight: {
    bg: "#020617",
    text: "#F8FAFC",
    muted: "#64748B",
    linkBg: "rgba(30, 41, 59, 0.5)",
    linkText: "#F8FAFC",
    linkBorder: "1px solid rgba(148, 163, 184, 0.1)",
    linkHoverBg: "rgba(30, 41, 59, 0.8)",
  },
  retro: {
    bg: "#F5F5DC",
    text: "#4B2E2E",
    muted: "#8B4513",
    linkBg: "#FFFFFF",
    linkText: "#4B2E2E",
    linkBorder: "2px solid #4B2E2E",
    linkHoverBg: "#EEE8AA",
  },
  summer: {
    bg: "#0EA5E9",
    text: "#FFFFFF",
    muted: "#E0F2FE",
    linkBg: "#FDE047",
    linkText: "#164E63",
    linkBorder: "none",
    linkHoverBg: "#FACC15",
  },
  glitch: {
    bg: "#FFFFFF",
    text: "#000000",
    muted: "#666666",
    linkBg: "#FFFFFF",
    linkText: "#000000",
    linkBorder: "2px solid #000000",
    linkHoverBg: "#00FF00",
  },
  chameleon: {
    bg: "#064E3B",
    text: "#FFFFFF",
    muted: "#D1FAE5",
    linkBg: "rgba(255,255,255,0.1)",
    linkText: "#FFFFFF",
    linkBorder: "1px solid rgba(255,255,255,0.2)",
    linkHoverBg: "rgba(255,255,255,0.2)",
  },
};

export default function BioPageClient({ page }: { page: BioPage }) {
  const theme = THEME_STYLES[page.theme] || THEME_STYLES.light;

  useEffect(() => {
    // Track page view
    const device = getDeviceType();
    const referrer = getReferrer();

    fetch("/api/views/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId: page.id, device, referrer }),
    }).catch(console.error);
  }, [page.id]);

  const handleLinkClick = (linkId: string, url: string) => {
    // Open in new tab and track
    window.open(
      `/api/links/track?pageId=${page.id}&linkId=${linkId}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: page.customBgColor || theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: page.fontFamily || "'Geist Sans', system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <DynamicBackground 
        type={
          page.backgroundEffect && page.backgroundEffect !== "none" ? page.backgroundEffect as any :
          page.theme === "winter" ? "snow" :
          page.theme === "rainynight" ? "rain" :
          page.theme === "chameleon" ? "mesh" :
          "none"
        }
        color={page.theme === "chameleon" || page.backgroundEffect === "mesh" ? "rgba(16, 185, 129, 0.4)" : undefined}
      />

      {page.theme === "christmas" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.15, background: "url('https://www.transparenttextures.com/patterns/snow.png')" }} />
      )}


      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: 480,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: page.photoURL
              ? `url(${page.photoURL}) center/cover`
              : "linear-gradient(135deg, #10B981, #06B6D4)",
            margin: "0 auto 16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        />

        {/* Name */}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: theme.text,
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {page.displayName}
        </h1>

        {/* Bio */}
        {page.bio && (
          <p
            style={{
              fontSize: 14,
              color: theme.muted,
              lineHeight: 1.6,
              maxWidth: 360,
              margin: "0 auto 28px",
            }}
          >
            {page.bio}
          </p>
        )}

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {page.links?.map((link) => {
            const isOutline = page.buttonStyle === "outline";
            const isGlass = page.buttonStyle === "glass" || page.theme === "glassy" || page.theme === "neon";
            const isPill = page.buttonStyle === "pill" || page.theme === "summer";
            const isRounded = page.buttonStyle === "rounded" || page.theme === "winter";

            // Smart Link Detection
            const ytMatch = link.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
            const spMatch = link.url.match(/open\.spotify\.com\/(track|album|playlist|show|episode)\/([a-zA-Z0-9]+)/);

            const buttonShapeStyles = {
              borderRadius: isPill ? 9999 : isRounded ? 12 : isGlass ? 20 : page.theme === "retro" ? 0 : 4,
            };

            const buttonWidget = (
              <button
                onClick={() => handleLinkClick(link.id, link.url)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "16px 24px",
                  ...buttonShapeStyles,
                  background: isOutline 
                    ? "transparent" 
                    : isGlass 
                      ? "rgba(255, 255, 255, 0.08)" 
                      : theme.linkBg,
                  color: isGlass ? "#FFFFFF" : isOutline ? theme.text : theme.linkText,
                  border: page.theme === "neon" 
                    ? "1px solid #7C3AED" 
                    : isOutline 
                      ? `2px solid ${theme.text}` 
                      : isGlass 
                        ? "1px solid rgba(255, 255, 255, 0.15)" 
                        : theme.linkBorder,
                  backdropFilter: isGlass ? "blur(20px)" : "none",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit",
                  width: "100%",
                  position: "relative",
                  boxShadow: page.theme === "neon" 
                    ? "0 0 15px rgba(124, 58, 237, 0.3)" 
                    : isGlass ? "0 8px 32px rgba(0,0,0,0.1)" 
                    : "none",
                }}
                onMouseOver={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = "translateY(-2px) scale(1.01)";
                  if (isOutline) {
                    target.style.background = theme.text;
                    target.style.color = theme.bg;
                  } else {
                    target.style.boxShadow = page.theme === "neon" 
                      ? "0 0 25px rgba(124, 58, 237, 0.6)" 
                      : isGlass ? "0 12px 40px rgba(0,0,0,0.15)" 
                      : "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  const target = e.currentTarget;
                  target.style.transform = "translateY(0) scale(1)";
                  if (isOutline) {
                    target.style.background = "transparent";
                    target.style.color = theme.text;
                  } else {
                    target.style.boxShadow = page.theme === "neon" 
                      ? "0 0 15px rgba(124, 58, 237, 0.3)" 
                      : isGlass ? "0 8px 32px rgba(0,0,0,0.1)" 
                      : "none";
                  }
                }}
              >
                {link.title}
                <ExternalLink size={16} style={{ opacity: 0.4 }} />
              </button>
            );

            return (
              <div key={link.id} style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                {/* YouTube Embed */}
                {ytMatch && (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", ...buttonShapeStyles, border: theme.linkBorder }}>
                    <iframe
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                
                {/* Spotify Embed */}
                {spMatch && (
                  <iframe
                    style={{ ...buttonShapeStyles, border: theme.linkBorder }}
                    src={`https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}?utm_source=generator`}
                    width="100%"
                    height={spMatch[1] === 'track' ? "152" : "352"}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                )}

                {buttonWidget}
              </div>
            );
          })}

        </div>

        {/* Footer — removed for paid plans */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: theme.muted,
              textDecoration: "none",
              opacity: 0.5,
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
            onMouseOut={(e) => { (e.target as HTMLElement).style.opacity = "0.5"; }}
          >
            <Zap size={12} />
            Powered by Auraix
          </a>
        </div>
      </div>
    </div>
  );
}
