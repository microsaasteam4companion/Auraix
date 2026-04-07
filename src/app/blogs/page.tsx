'use client';

import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";
import { BLOGS } from "@/lib/blogs-data";
import { ArrowLeft, Sparkles, Zap, BarChart3, Shield, Star, Globe, TrendingUp, Cpu, Users } from "lucide-react";

// Map icons to IDs for the listing
const BLOG_ICONS: Record<number, React.ReactNode> = {
  1: <Cpu size={24} />,
  2: <Sparkles size={24} />,
  3: <Star size={24} />,
  4: <BarChart3 size={24} />,
  5: <Zap size={24} />,
  6: <Shield size={24} />,
  7: <TrendingUp size={24} />,
  8: <Globe size={24} />,
  9: <Cpu size={24} />,
  10: <Users size={24} />,
};

export default function BlogsPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", position: "relative" }}>
      <DynamicBackground type="aurora" />
      
      {/* Navbar */}
      <nav style={{ padding: "20px 8%", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text-primary)", fontWeight: 700, fontSize: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
            <img src="/logo.png" alt="Auraix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          Auraix
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14 }}>Home</Link>
        </div>
      </nav>

      <main style={{ padding: "80px 8% 120px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", marginBottom: 80 }}>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 20 }}>
            The <span style={{ background: "linear-gradient(135deg, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Auraix</span> Blog
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Explore the intersection of AI and digital identity. Learn how to stand out in the creator economy.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {BLOGS.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
              <div 
                style={{ 
                  background: "var(--bg-card)", 
                  border: "1px solid var(--border-subtle)", 
                  borderRadius: 24, 
                  padding: 32, 
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%"
                }}
                className="blog-card"
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${blog.color}15`, color: blog.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  {BLOG_ICONS[blog.id]}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{blog.date}</div>
                <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>{blog.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{blog.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: blog.color, fontWeight: 600, fontSize: 14 }}>
                  Read Article <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-8px);
          border-color: rgba(167, 139, 250, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
