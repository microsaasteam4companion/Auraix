'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
import DynamicBackground from '@/components/DynamicBackground';
import { BLOGS } from '@/lib/blogs-data';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const blogId = parseInt(id);
  const blog = BLOGS.find((b) => b.id === blogId);

  if (!blog) {
    return (
      <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <DynamicBackground type="aurora" />
        <h1 style={{ fontSize: 32, marginBottom: 24, position: "relative", zIndex: 1 }}>Article Not Found</h1>
        <Link href="/blogs" style={{ color: "#A78BFA", textDecoration: "none", position: "relative", zIndex: 1 }}>Back to Blog</Link>
      </div>
    );
  }

  const relatedBlogs = BLOGS.filter(b => blog.relatedIds.includes(b.id));

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", position: "relative" }}>
      <DynamicBackground type="aurora" />

      {/* Navbar */}
      <nav style={{ padding: "20px 8%", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <Link href="/blogs" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text-primary)", fontWeight: 600, fontSize: 16 }}>
          <ArrowLeft size={18} /> Back to Blog
        </Link>
        <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14 }}>Home</Link>
      </nav>

      <main style={{ padding: "60px 8% 120px", position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: 60, maxWidth: 800 }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 12, 
            background: `${blog.color}15`, 
            color: blog.color, 
            padding: "6px 16px", 
            borderRadius: 100, 
            fontSize: 14, 
            fontWeight: 600,
            marginBottom: 24 
          }}>
            <Calendar size={14} /> {blog.date}
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 32 }}>
            {blog.title}
          </h1>
          
          {/* Summary Box */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.03)", 
            padding: "32px", 
            borderRadius: 24, 
            border: "1px solid var(--border-subtle)",
            backdropFilter: "blur(10px)",
            marginBottom: 40
          }}>
            <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 12, fontWeight: 700 }}>Summary</h3>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {blog.summary}
            </p>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 80, alignItems: "start" }} className="blog-container">
          
          {/* Main Content */}
          <article style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} className="prose" />
            
            {/* Related Blogs Section */}
            <div style={{ marginTop: 100, paddingTop: 60, borderTop: "1px solid var(--border-subtle)" }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40, color: "var(--text-primary)" }}>Related Articles</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                {relatedBlogs.map(rb => (
                  <Link key={rb.id} href={`/blogs/${rb.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ 
                      background: "var(--bg-card)", 
                      border: "1px solid var(--border-subtle)", 
                      borderRadius: 20, 
                      padding: 24,
                      transition: "transform 0.3s ease",
                      height: "100%"
                    }} className="hover-lift">
                      <div style={{ fontSize: 12, color: rb.color, fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>{rb.date}</div>
                      <h4 style={{ fontSize: 18, color: "var(--text-primary)", marginBottom: 12, lineHeight: 1.4 }}>{rb.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 14, fontWeight: 600 }}>
                        Read More <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar - TOC */}
          <aside style={{ position: "sticky", top: 120 }}>
            <div style={{ 
              background: "rgba(255, 255, 255, 0.02)", 
              border: "1px solid var(--border-subtle)", 
              borderRadius: 24, 
              padding: 32,
              backdropFilter: "blur(10px)"
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={18} /> Table of Contents
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {blog.toc.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 16 }}>
                    <a href={`#${item.anchor}`} style={{ 
                      color: "var(--text-secondary)", 
                      textDecoration: "none", 
                      fontSize: 14,
                      transition: "color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }} className="toc-link">
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{idx + 1}.</span> {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .prose :global(h2) {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 60px;
          margin-bottom: 24px;
        }
        .prose :global(p) {
          margin-bottom: 32px;
        }
        .toc-link:hover {
          color: #A78BFA !important;
        }
        @media (max-width: 1024px) {
          .blog-container {
            grid-template-columns: 1fr;
          }
          aside {
            position: relative;
            top: 0;
            order: -1;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </div>
  );
}
