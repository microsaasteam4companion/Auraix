"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  PlusCircle,
  Search,
  Eye,
  MousePointerClick,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import { getUserPages, deleteBioPage } from "@/lib/firestore";
import type { BioPage } from "@/types";
import { formatNumber, formatDate, getDisplayDomain } from "@/lib/utils";
import ShareModal from "@/components/ShareModal";

export default function MyPagesPage() {
  const { user } = useUser();
  const [pages, setPages] = useState<BioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updatedAt" | "createdAt" | "totalViews">("updatedAt");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [shareData, setShareData] = useState<{ url: string; slug: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    loadPages();
  }, [user]);

  async function loadPages() {
    if (!user) return;
    try {
      setError(null);
      const data = await getUserPages(user.id);
      setPages(data);
    } catch (err: unknown) {
      console.error("Failed to load pages:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("index")) {
        setError("Firestore index required. Check browser console for the index creation link.");
      } else {
        setError("Failed to load pages: " + msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(page: BioPage) {
    if (!user) return;
    try {
      await deleteBioPage(page.id, page.slug, user.id);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = pages
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "totalViews") return (b.totalViews || 0) - (a.totalViews || 0);
      const dateA = a[sortBy] instanceof Date ? a[sortBy].getTime() : 0;
      const dateB = b[sortBy] instanceof Date ? b[sortBy].getTime() : 0;
      return dateB - dateA;
    });

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 80,
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: "var(--error-light)",
            border: "1px solid var(--error)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            marginBottom: 16,
            color: "var(--error)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>My Pages</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>
            {pages.length} page{pages.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          href="/dashboard/pages/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 18px",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s",
          }}
        >
          <PlusCircle size={16} /> New Page
        </Link>
      </div>

      {/* Search & Sort */}
      {pages.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 200,
              position: "relative",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border 0.15s",
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: 14,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="totalViews">Most Views</option>
          </select>
        </div>
      )}

      {/* Pages Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "56px 24px",
            textAlign: "center",
          }}
        >
          <FileText size={44} color="var(--text-muted)" />
          <div style={{ fontWeight: 600, fontSize: 17, marginTop: 12, marginBottom: 4 }}>
            {search ? "No pages match your search" : "No pages yet"}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
            {search ? "Try a different search term" : "Create your first bio link page"}
          </div>
          {!search && (
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
              <PlusCircle size={16} /> Create Page
            </Link>
          )}
        </div>
      ) : (
        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((page) => (
            <div
              key={page.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.25s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: page.photoURL
                      ? `url(${page.photoURL}) center/cover`
                      : "linear-gradient(135deg, #10B981, #06B6D4)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {page.title || page.displayName || page.slug}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{getDisplayDomain()}/{page.slug}</div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "var(--radius-full)",
                    background: page.isPublished ? "var(--success-light)" : "var(--warning-light)",
                    color: page.isPublished ? "var(--success)" : "var(--warning)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {page.isPublished ? "Live" : "Draft"}
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 14,
                  padding: "10px 0",
                  borderTop: "1px solid var(--border-subtle)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Eye size={13} /> {formatNumber(page.totalViews || 0)} views
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MousePointerClick size={13} /> {page.links?.length || 0} links
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <Link
                  href={`/dashboard/pages/${page.id}/edit`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Pencil size={13} /> Edit
                </Link>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/${page.slug}`;
                    setShareData({ url, slug: page.slug });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Copy size={14} />
                </button>
                <Link
                  href={`/${page.slug}`}
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={() =>
                    deleteConfirm === page.id
                      ? handleDelete(page)
                      : setDeleteConfirm(page.id)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid",
                    borderColor: deleteConfirm === page.id ? "var(--error)" : "var(--border-subtle)",
                    background: deleteConfirm === page.id ? "var(--error-light)" : "transparent",
                    color: deleteConfirm === page.id ? "var(--error)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontSize: 11,
                  }}
                  title={deleteConfirm === page.id ? "Click again to confirm" : "Delete"}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareData && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareData(null)}
          pageUrl={shareData.url}
          slug={shareData.slug}
        />
      )}
    </div>
  );
}
