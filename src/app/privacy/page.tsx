import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", position: "relative" }}>
      <DynamicBackground type="aurora" />
      
      <main style={{ padding: "100px 8% 120px", position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 32 }}>
          Privacy <span style={{ background: "linear-gradient(135deg, #38BDF8, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Policy</span>
        </h1>
        
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 24, padding: "40px", fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 20 }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>1. Information We Collect</h2>
          <p style={{ marginBottom: 20 }}>We collect information to provide better services to our users. We collect information in the following ways:<br/>- Information you give us (e.g., account registration).<br/>- Information we get from your use of our services (e.g., analytics).</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>2. How We Use Information</h2>
          <p style={{ marginBottom: 20 }}>We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect Auraix and our users.</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>3. Information Security</h2>
          <p style={{ marginBottom: 20 }}>We work hard to protect Auraix and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.</p>
          
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <Link href="/" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
