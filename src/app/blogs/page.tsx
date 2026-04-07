import Link from "next/link";
import { ArrowLeft, Sparkles, Zap, BarChart3, Shield, Star, Globe, TrendingUp, Cpu, Users } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import ThemeToggle from "@/components/ThemeToggle";

const blogs = [
  {
    id: 1,
    title: "Auraix vs Others: Why AI Makes the Difference",
    excerpt: "Most link-in-bio tools are just lists. Auraix uses AI to craft a narrative that resonates with your audience.",
    icon: <Cpu size={24} />,
    color: "#A78BFA",
    date: "April 7, 2026"
  },
  {
    id: 2,
    title: "The Magic of AI Bio Generation",
    excerpt: "Never struggle with 'about me' again. Our AI analyzes your social presence to write the perfect bio.",
    icon: <Sparkles size={24} />,
    color: "#F472B6",
    date: "April 6, 2026"
  },
  {
    id: 3,
    title: "Crafting Your Digital Aura",
    excerpt: "Identity isn't just links; it's a feeling. Our premium themes are designed to create a lasting impression.",
    icon: <Star size={24} />,
    color: "#C084FC",
    date: "April 5, 2026"
  },
  {
    id: 4,
    title: "Tracking What Matters: Analytics",
    excerpt: "Go beyond simple click counts. Understand your audience with real-time insights and growth tracking.",
    icon: <BarChart3 size={24} />,
    color: "#38BDF8",
    date: "April 4, 2026"
  },
  {
    id: 5,
    title: "The One-Minute Setup Guide",
    excerpt: "From signup to a live, beautiful page in under 60 seconds. Efficiency meets premium design.",
    icon: <Zap size={24} />,
    color: "#FBBF24",
    date: "April 3, 2026"
  },
  {
    id: 6,
    title: "Security & Privacy First",
    excerpt: "In a world of data mining, Auraix protects your digital footprint with state-of-the-art security.",
    icon: <Shield size={24} />,
    color: "#34D399",
    date: "April 2, 2026"
  },
  {
    id: 7,
    title: "Growing on Instagram & TikTok",
    excerpt: "Strategic link placement and AI-optimized CTAs to convert your followers into dedicated fans.",
    icon: <TrendingUp size={24} />,
    color: "#F87171",
    date: "April 1, 2026"
  },
  {
    id: 8,
    title: "Unlocking Pro: Advanced Animations",
    excerpt: "Take your page to the next level with dynamic backgrounds and smooth transitions that wow every visitor.",
    icon: <Globe size={24} />,
    color: "#818CF8",
    date: "March 31, 2026"
  },
  {
    id: 9,
    title: "The Future of Digital Identity",
    excerpt: "Where is the 'link-in-bio' space heading? Discover how AI is transforming personal branding.",
    icon: <Cpu size={24} />,
    color: "#FB7185",
    date: "March 30, 2026"
  },
  {
    id: 10,
    title: "Creator Stories: Success with Auraix",
    excerpt: "How a travel blogger increased their affiliate revenue by 40% using our AI-optimized layout.",
    icon: <Users size={24} />,
    color: "#2DD4BF",
    date: "March 29, 2026"
  }
];

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
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              style={{ 
                background: "var(--bg-card)", 
                border: "1px solid var(--border-subtle)", 
                borderRadius: 24, 
                padding: 32, 
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              className="blog-card"
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${blog.color}15`, color: blog.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                {blog.icon}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{blog.date}</div>
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, color: "var(--text-primary)" }}>{blog.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{blog.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: blog.color, fontWeight: 600, fontSize: 14 }}>
                Read Article <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
              </div>
            </div>
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
