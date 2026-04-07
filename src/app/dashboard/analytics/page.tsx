"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  TrendingUp,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { getUserPages, getPageAnalytics, getUserProfile } from "@/lib/firestore";
import type { BioPage, PageAnalytics, UserProfile } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10B981", "#06B6D4", "#A78BFA", "#F59E0B", "#EC4899"];

export default function AnalyticsPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pages, setPages] = useState<BioPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [analytics, setAnalytics] = useState<PageAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const p = await getUserProfile(user!.id);
        setProfile(p);
        const userPages = await getUserPages(user!.id);
        setPages(userPages);
        if (userPages.length > 0) {
          setSelectedPage(userPages[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    if (!selectedPage) return;
    async function loadAnalytics() {
      try {
        const data = await getPageAnalytics(selectedPage, 30);
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadAnalytics();
  }, [selectedPage]);

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: 200,
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}
          />
        ))}
      </div>
    );
  }

  /* 
  // Temporarily disabled Pro check to make analytics working for everyone
  if (profile && profile.plan === "free") {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "80px 24px" }}>
        <div
          style={{
            display: "inline-flex",
            width: 64,
            height: 64,
            borderRadius: "var(--radius-lg)",
            background: "var(--accent-light)",
            color: "var(--accent)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Lock size={28} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Analytics is a Pro feature</h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 15,
            maxWidth: 400,
            margin: "0 auto 24px",
            lineHeight: 1.6,
          }}
        >
          Upgrade to Pro to unlock detailed analytics including views, clicks, device
          breakdown, and referrers.
        </p>
        <Link
          href="/dashboard/settings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <ArrowUpRight size={16} /> Upgrade to Pro
        </Link>
      </div>
    );
  }
  */

  if (pages.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "80px 24px" }}>
        <BarChart3 size={44} color="var(--text-muted)" />
        <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>No pages to analyze</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, marginBottom: 24, fontSize: 14 }}>
          Create a bio page first to see analytics.
        </p>
        <Link
          href="/dashboard/pages/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Create Page
        </Link>
      </div>
    );
  }

  const totalViews = analytics.reduce((s, a) => s + a.views, 0);
  const totalClicks = analytics.reduce((s, a) => {
    return s + Object.values(a.clicks || {}).reduce((cs, c) => cs + c, 0);
  }, 0);

  // Aggregate device data
  const deviceData = analytics.reduce(
    (a, d) => ({
      desktop: a.desktop + (d.devices?.desktop || 0),
      mobile: a.mobile + (d.devices?.mobile || 0),
    }),
    { desktop: 0, mobile: 0 }
  );
  const pieData = [
    { name: "Desktop", value: deviceData.desktop },
    { name: "Mobile", value: deviceData.mobile },
  ].filter((d) => d.value > 0);

  // Top links by clicks
  const linkClickMap: Record<string, number> = {};
  const currentPage = pages.find((p) => p.id === selectedPage);
  analytics.forEach((a) => {
    Object.entries(a.clicks || {}).forEach(([linkId, count]) => {
      linkClickMap[linkId] = (linkClickMap[linkId] || 0) + count;
    });
  });
  const topLinks = Object.entries(linkClickMap)
    .map(([linkId, clicks]) => ({
      name: currentPage?.links.find((l) => l.id === linkId)?.title || linkId,
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>Analytics</h1>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontSize: 14,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title || p.slug}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Views (30d)", value: formatNumber(totalViews), icon: <Eye size={18} />, color: "var(--accent)", bg: "var(--accent-light)" },
          { label: "Clicks (30d)", value: formatNumber(totalClicks), icon: <MousePointerClick size={18} />, color: "var(--success)", bg: "var(--success-light)" },
          { label: "All-time Views", value: formatNumber(currentPage?.totalViews || 0), icon: <TrendingUp size={18} />, color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: 18,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {/* Views Over Time */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Daily Views</h3>
          {analytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} width={30} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No data yet — views will appear here
            </div>
          )}
        </div>

        {/* Top Links */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Links by Clicks</h3>
          {topLinks.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topLinks} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="clicks" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No clicks tracked yet
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Devices</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={((entry: {name?: string; percent?: number}) => `${entry.name ?? ''} ${(((entry.percent) ?? 0) * 100).toFixed(0)}%`) as unknown as boolean}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No device data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
