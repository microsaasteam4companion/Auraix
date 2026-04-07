import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", position: "relative" }}>
      <DynamicBackground type="aurora" />
      
      <main style={{ padding: "100px 8% 120px", position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 32 }}>
          Terms and <span style={{ background: "linear-gradient(135deg, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Conditions</span>
        </h1>
        
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 24, padding: "40px", fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 20 }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: 20 }}>By accessing and using Auraix, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>2. Use License</h2>
          <p style={{ marginBottom: 20 }}>Permission is granted to temporarily download one copy of the materials (information or software) on Auraix's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 style={{ fontSize: 22, color: "var(--text-primary)", marginTop: 32, marginBottom: 16, fontWeight: 600 }}>3. Disclaimer</h2>
          <p style={{ marginBottom: 20 }}>The materials on Auraix's website are provided on an 'as is' basis. Auraix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <Link href="/" style={{ color: "#A78BFA", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
