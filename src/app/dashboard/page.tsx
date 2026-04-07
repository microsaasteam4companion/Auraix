"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  FileText,
  Eye,
  MousePointerClick,
  TrendingUp,
  ExternalLink,
  Copy,
  LayoutDashboard,
  BarChart,
  User,
  Share2,
} from "lucide-react";
import { getUserProfile, getUserPages, createUserProfile } from "@/lib/firestore";
import { PLAN_LIMITS, canCreatePage } from "@/lib/plans";
import type { UserProfile, BioPage } from "@/types";
import { formatNumber, formatDate } from "@/lib/utils";
import ShareModal from "@/components/ShareModal";

export default function DashboardOverview() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pages, setPages] = useState<BioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<{ url: string; slug: string } | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function load() {
      try {
        let p = await getUserProfile(user!.id);
        if (!p) {
          await createUserProfile(user!.id, {
            uid: user!.id,
            email: user!.primaryEmailAddress?.emailAddress || "",
            displayName: user!.fullName || "",
            photoURL: user!.imageUrl || "",
          });
          p = await getUserProfile(user!.id);
        }
        setProfile(p);

        const userPages = await getUserPages(user!.id);
        setPages(userPages);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 100,
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}
          />
        ))}
      </div>
    );
  }

  const plan = PLAN_LIMITS[profile?.plan || "free"];
  const pagesUsed = profile?.pagesUsed || 0;
  const totalViews = pages.reduce((sum, p) => sum + (p.totalViews || 0), 0);
  const totalLinks = pages.reduce((sum, p) => sum + (p.links?.length || 0), 0);

  // Find most popular page
  const popularPage = pages.length > 0 ? [...pages].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))[0] : null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* ── BENTO GRID LAYOUT ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "minmax(140px, auto)",
          gap: 20,
        }}
        className="bento-grid"
      >
        {/* Card 1: Welcome & Primary CTA (Col Span 2) */}
        <div
          style={{
            gridColumn: "span 2",
            background: "linear-gradient(135deg, var(--accent), #8B5CF6)",
            borderRadius: "var(--radius-lg)",
            padding: 32,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
          }}
        >
          {/* Decorative background circle */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, position: "relative" }}>
            Welcome, {user?.firstName || "Creator"}
          </h1>
          <p style={{ opacity: 0.9, fontSize: 15, marginBottom: 24, maxWidth: "80%" }}>
            Your digital ecosystem is growing. You have used {pagesUsed} out of {plan.pages} pages.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/dashboard/pages/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: "var(--accent)",
                padding: "10px 20px",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
            >
              <PlusCircle size={18} /> Create New Page
            </Link>
          </div>
        </div>

        {/* Card 2: Plan Info (Col Span 1) */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ padding: 10, borderRadius: "var(--radius-md)", background: "rgba(167,139,250,0.1)", color: "#A78BFA" }}>
              <TrendingUp size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Current Plan</span>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>{plan.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Unlimited features unlocked
            </div>
          </div>
          {profile?.plan === "free" && (
            <Link
              href="/dashboard/settings"
              style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--accent)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Learn more <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {/* Card 3: Featured / Popular Page (Row Span 2, Col Span 2) */}
        <div
          style={{
            gridColumn: "span 2",
            gridRow: "span 2",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 32,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Featured Performance</h2>
            <div style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "var(--success-light)", color: "var(--success)", fontSize: 12, fontWeight: 600 }}>
              Running Smoothly
            </div>
          </div>

          {popularPage ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "24px",
                    background: popularPage.photoURL ? `url(${popularPage.photoURL}) center/cover` : "linear-gradient(135deg, #10B981, #06B6D4)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{popularPage.title || popularPage.slug}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 14 }}> /{popularPage.slug}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 40, marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Views</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "var(--success)" }}>{formatNumber(popularPage.totalViews || 0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Links</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>{popularPage.links?.length || 0}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Link 
                  href={`/dashboard/pages/${popularPage.id}/edit`}
                  style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: "12px", background: "var(--bg-secondary)", color: "var(--text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid var(--border-subtle)" }}
                >
                  Quick Edit
                </Link>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/${popularPage.slug}`;
                    setShareData({ url, slug: popularPage.slug });
                  }}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: "12px", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
                >
                  <Share2 size={16} /> Share Page
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, border: "2px dashed var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
              <FileText size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Create your first page to see performance metrics here.</p>
            </div>
          )}
        </div>

        {/* Card 4: Total Views (Col Span 1) */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <div style={{ color: "var(--success)", marginBottom: 8, display: "flex", justifyContent: "center" }}><Eye size={24} /></div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{formatNumber(totalViews)}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>Total Views</div>
        </div>

        {/* Card 5: Total Links (Col Span 1) */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <div style={{ color: "#06B6D4", marginBottom: 8, display: "flex", justifyContent: "center" }}><MousePointerClick size={24} /></div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{formatNumber(totalLinks)}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>Total Links</div>
        </div>

        {/* Card 6: AI Power-up (Col Span 1) */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(99,102,241,0.1))",
            border: "1px solid rgba(236,72,153,0.2)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Sparkles size={20} style={{ position: "absolute", top: 12, right: 12, color: "#EC4899" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>AI Bio Link</h3>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Generate professional bios instantly using xAI Grok.</p>
          <Link
            href="/dashboard/pages/new?ai=true"
            style={{ fontSize: 13, fontWeight: 700, color: "#EC4899", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
          >
            Try AI magic <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Card 7: Usage Tracker (Col Span 2) */}
        <div
          style={{
            gridColumn: "span 2",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Platform Usage</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{pagesUsed} / {plan.pages} pages</span>
          </div>
          <div style={{ height: 12, borderRadius: 6, background: "var(--bg-secondary)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(pagesUsed / plan.pages) * 100}%`, background: "linear-gradient(90deg, var(--accent), #8B5CF6)", borderRadius: 6, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Card 8: Recent Activity (Col Span 3) */}
        <div
          style={{
            gridColumn: "span 3",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Pages</h2>
            <Link href="/dashboard/pages" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>View all records →</Link>
          </div>

          {pages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)" }}>No activity yet. Stand out by creating your first Bio Link.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {pages.slice(0, 3).map((page) => (
                <div
                  key={page.id}
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    transition: "all 0.2s",
                  }}
                  className="hover-lift"
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: page.photoURL ? `url(${page.photoURL}) center/cover` : "var(--accent)" }} />
                    <div style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.slug}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Eye size={12} /> {page.totalViews || 0}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MousePointerClick size={12} /> {page.links?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {shareData && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareData(null)}
          pageUrl={shareData.url}
          slug={shareData.slug}
        />
      )}

      <style jsx global>{`
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .bento-grid > div {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
