import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";

export default function CookiePage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", position: "relative" }}>
      <DynamicBackground type="aurora" />
      
      <main style={{ padding: "100px 8% 120px", position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 32 }}>
          Cookie <span style={{ background: "linear-gradient(135deg, #FBBF24, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Policy</span>
        </h1>
        
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 24, padding: "40px", fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 20 }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>1. What Are Cookies</h2>
          <p style={{ marginBottom: 20 }}>Cookies are small files which are stored on your computer. They are designed to hold a modest amount of data specific to a particular client and website, and can be accessed either by the web server or the client computer.</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>2. How We Use Cookies</h2>
          <p style={{ marginBottom: 20 }}>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>3. Disabling Cookies</h2>
          <p style={{ marginBottom: 20 }}>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>
          
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <Link href="/" style={{ color: "#FBBF24", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
