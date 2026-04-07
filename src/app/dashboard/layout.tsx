"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Zap,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/pages", icon: FileText, label: "My Pages" },
  { href: "/dashboard/pages/new", icon: PlusCircle, label: "Create Page" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-secondary)" }}>
        {/* ── Mobile Overlay ── */}
        {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease",
        }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <img src="/logo.png" alt="Auraix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            Auraix
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 450,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-light)" : "transparent",
                  transition: "all 0.15s",
                  position: "relative",
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 20,
                      borderRadius: 4,
                      background: "var(--accent)",
                    }}
                  />
                )}
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <div style={{ margin: "8px 0", height: 1, background: "var(--border-subtle)" }} />
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 450,
              color: "var(--text-secondary)",
              transition: "all 0.15s",
            }}
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </nav>

        {/* Bottom: user */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border-subtle)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--bg-secondary)",
            }}
          >
            <UserButton
              appearance={{
                elements: { avatarBox: { width: 34, height: 34 } },
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "var(--text-primary)",
                }}
              >
                {user?.fullName || "User"}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  background: "rgba(167, 139, 250, 0.1)",
                  color: "var(--accent)",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                <ChevronUp size={9} /> Free
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          flex: 1,
          marginLeft: 260,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        className="main-content"
      >
        {/* Mobile Header */}
        <header
          className="mobile-header"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              padding: 4,
            }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <img src="/logo.png" alt="Auraix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Auraix</span>
          </div>
          <UserButton />
        </header>

        <div style={{ flex: 1, padding: "28px 32px" }} className="content-padding">
          {children}
        </div>
      </main>

      {/* ── Responsive CSS ── */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .sidebar-desktop {
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"} !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .content-padding {
            padding: 16px !important;
          }
        }
      `}</style>
      </div>
  );
}
