"use client";

import { useEffect, useState, use } from "react";
import { getBioPageBySlug } from "@/lib/firestore";
import BioPageClient from "./BioPageClient";
import type { BioPage } from "@/types";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function PublicBioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [page, setPage] = useState<BioPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        console.log("[Auraix] Loading slug:", slug);
        const data = await getBioPageBySlug(slug);
        console.log("[Auraix] Slug data:", data);

        if (!data) {
          setError("not_found");
          return;
        }

        setPage(data);
      } catch (err) {
        console.error("[Auraix] Failed to load page:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
          fontFamily: "'Geist Sans', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #E5E7EB",
            borderTopColor: "#6366F1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
          fontFamily: "'Geist Sans', system-ui, sans-serif",
          color: "#374151",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "#E5E7EB", marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {error === "not_published" ? "This page is not published" : "Page not found"}
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>
          The page <strong>/{slug}</strong> doesn&apos;t exist or isn&apos;t live yet.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            background: "#6366F1",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <Zap size={14} /> Create your own Auraix
        </Link>
      </div>
    );
  }

  return <BioPageClient page={page} />;
}
