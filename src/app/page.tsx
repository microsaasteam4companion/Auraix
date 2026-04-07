import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import UpvoteWidget from "@/components/UpvoteWidget";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Palette,
  Globe,
  Zap,
  Star,
  Link2,
  MousePointerClick,
  Shield,
  Check,
  MessageCircle,
  Newspaper,
  ChevronDown
} from "lucide-react";
import LandingAnimations from "./LandingAnimations";
import DynamicBackground from "@/components/DynamicBackground";
import PricingButton from "@/components/PricingButton";
import ThemeToggle from "@/components/ThemeToggle";

export default async function LandingPage() {
  const user = await currentUser();
  const userId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <LandingAnimations />

      {/* ── Navbar ── */}
      <nav
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          width: "min(92%, 1100px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#F1F5F9",
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <img src="/logo.png" alt="Auraix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            Auraix
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <a href="#features" style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "8px 14px", transition: "color 0.2s" }}>Use case</a>
            <a href="#pricing" style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "8px 14px", transition: "color 0.2s" }}>Pricing</a>
            <Link href="/blogs" style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "8px 14px", transition: "color 0.2s" }}>Blog</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!userId ? (
              <>
                <a href="/sign-in" style={{ color: "var(--text-primary)", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "10px 24px", border: "1px solid var(--border-subtle)", borderRadius: 30, transition: "all 0.2s" }} className="hover-lift">Login</a>
                <a href="/sign-up" style={{ background: "var(--text-primary)", color: "var(--bg-primary)", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "10px 24px", borderRadius: 30, transition: "all 0.2s" }} className="hover-lift">Signup</a>
              </>
            ) : (
              <a href="/dashboard" style={{ background: "var(--text-primary)", color: "var(--bg-primary)", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "10px 24px", borderRadius: 30, transition: "all 0.2s" }} className="hover-lift">Dashboard</a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "160px 8% 80px",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0, perspective: "1000px" }}>
          {/* Deep Space Gradients / Animated Orbs */}
          <div className="animate-shape-spin-1" style={{ position: "absolute", top: "10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="animate-shape-spin-2" style={{ position: "absolute", bottom: "10%", right: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(244, 114, 182, 0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="animate-shape-spin-1" style={{ position: "absolute", top: "30%", left: "55%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(192, 132, 252, 0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

          {/* Aurora Ribbon Background */}
          <DynamicBackground type="aurora" />
        </div>

        {/* Left-Aligned Hero Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
          <h1 className="reveal" style={{ fontSize: "clamp(52px, 7vw, 76px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 28, color: "#FFFFFF", fontFamily: "var(--font-sans)" }}>
            Your digital identity,<br />
            powered by <span style={{
              background: "linear-gradient(135deg, #A78BFA, #F472B6, #C084FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
              paddingRight: 10
            }}>AI</span>.
          </h1>

          <p className="reveal" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#94A3B8", lineHeight: 1.6, marginBottom: 48, maxWidth: 480, fontWeight: 400 }}>
            Generate a beautiful link-in-bio page in seconds. Let our AI craft your perfect bio, add your links, and track every click securely.
          </p>

          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16 }}>

            <a
              href="/sign-up"
              className="hover-lift hover-glow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 30,
                transition: "all 0.3s",
              }}
            >
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(167, 139, 250, 0.1)", border: "1px solid rgba(167, 139, 250, 0.2)", color: "#C084FC", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>How it works</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Three steps to stand out</h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>Go from zero to a stunning bio page in under a minute.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {[
              { step: "01", icon: <Link2 size={24} />, title: "Create your page", desc: "Sign up and claim your unique link. Choose a theme that matches your style." },
              { step: "02", icon: <Sparkles size={24} />, title: "Add links & AI bio", desc: "Add your social links and let our Grok-powered AI generate a perfect bio for you." },
              { step: "03", icon: <Globe size={24} />, title: "Share everywhere", desc: "Drop your link in your Instagram, TikTok, Twitter bio — one link for everything." },
            ].map((item, i) => (
              <div
                key={item.step}
                className="reveal hover-lift"
                style={{
                  background: "#0D1117",
                  border: "1px solid #1E293B",
                  borderRadius: 20,
                  padding: 32,
                  position: "relative",
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#1E293B", fontFamily: "var(--font-mono)" }}>{item.step}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167, 139, 250, 0.1)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#F1F5F9" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(167, 139, 250, 0.1)", border: "1px solid rgba(167, 139, 250, 0.2)", color: "#A78BFA", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Features</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Everything in one place</h2>
            <p style={{ color: "#94A3B8", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Craft a unique and cohesive identity with powerful drag-and-drop tools.</p>
          </div>

          <div className="bento-grid">
            {/* Box 1: Small/Standard */}
            <div className="bento-card reveal hover-lift" style={{ gridColumn: "span 1" }}>
              <div className="bento-glow" style={{ top: "-50px", left: "-50px" }} />
              <div className="bento-content">
                <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "inline-block", borderRadius: "12px", marginBottom: "20px" }}>
                  <Palette size={24} color="#A78BFA" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>Branding</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 20 }}>Craft a unique and cohesive brand identity with beautiful light and dark themes.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>See More <ArrowRight size={14} /></div>
              </div>
            </div>

            {/* Box 2: Large Wide */}
            <div className="bento-card reveal hover-lift" style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="bento-glow" style={{ top: "auto", bottom: "-50px", right: "-50px", background: "radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, transparent 60%)" }} />
              <div className="bento-content">
                <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "inline-block", borderRadius: "12px", marginBottom: "20px" }}>
                  <BarChart3 size={24} color="#F472B6" />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>Analytics & Insights</h3>
                <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.6, maxWidth: 300, marginBottom: 20 }}>Track every click with comprehensive real-time view counters and analytics.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>See More <ArrowRight size={14} /></div>

                {/* Visual Chart Mockup */}
                <div style={{ position: "absolute", bottom: -20, right: -20, width: 280, height: 160, background: "rgba(0,0,0,0.4)", borderTopLeftRadius: 24, border: "1px solid rgba(255,255,255,0.05)", padding: 20, zIndex: -1 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: 12, opacity: 0.8 }}>
                    {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: "linear-gradient(to top, #A78BFA, rgba(244, 114, 182, 0.5))", height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Small/Standard */}
            <div className="bento-card reveal hover-lift" style={{ gridColumn: "span 1" }}>
              <div className="bento-glow" style={{ bottom: "-50px", right: "-50px", background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)" }} />
              <div className="bento-content">
                <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "inline-block", borderRadius: "12px", marginBottom: "20px" }}>
                  <Shield size={24} color="#38BDF8" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>Complete Control</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 20 }}>Draft pages privately before you publish to the world. One toggle to go live.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>See More <ArrowRight size={14} /></div>
              </div>
            </div>

            {/* Box 4: Large Wide */}
            <div className="bento-card reveal hover-lift" style={{ gridColumn: "span 3", minHeight: 320, display: "flex", alignItems: "center", overflow: "hidden" }}>
              <div className="bento-glow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 60%)" }} />
              <div className="bento-content" style={{ display: "flex", width: "100%", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 300px" }}>
                  <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "inline-block", borderRadius: "12px", marginBottom: "20px" }}>
                    <Sparkles size={24} color="#A78BFA" />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>AI Bio Generator</h3>
                  <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, maxWidth: 380, marginBottom: 24 }}>Enter your social handle and let our integrated framework craft a perfect bio. Never worry about what to say again.</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>See More <ArrowRight size={14} /></div>
                </div>
                {/* Code Window Mockup */}
                <div style={{ flex: "1 1 250px", background: "#050508", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, position: "relative", minHeight: 200 }}>
                  <div style={{ display: "flex", gap: 6, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4A6A" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4A6A" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4A6A" }} />
                  </div>
                  <div style={{ padding: 20, fontFamily: "var(--font-mono)", fontSize: 12, color: "#A78BFA", lineHeight: 1.8 }}>
                    <div>Generating bio...</div>
                    <div style={{ color: "#E2E8F0", marginTop: 12 }}>"Digital creator & software <br /> engineer building the future <br /> of the web. Sharing my <br /> journey one project at a time."</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 5: Small/Standard */}
            <div className="bento-card reveal hover-lift" style={{ gridColumn: "span 1" }}>
              <div className="bento-glow" style={{ top: "-50px", right: "-50px" }} />
              <div className="bento-content">
                <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", display: "inline-block", borderRadius: "12px", marginBottom: "20px" }}>
                  <Star size={24} color="#A78BFA" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "#F1F5F9", marginBottom: 12 }}>Generate QR</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 20 }}>Print offline and grow fast. Scan instantly from anywhere.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>See More <ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Marquee ── */}
      <section style={{ padding: "60px 0", overflow: "hidden", borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
          {[...Array(2)].map((_, setIdx) =>
            [
              { name: "Sarah M.", role: "Content Creator", text: "Auraix replaced 3 tools for me. The AI bio generator is magic!" },
              { name: "James K.", role: "Photographer", text: "Clean, minimal design. My clients love the professional look." },
              { name: "Priya S.", role: "Developer", text: "Analytics are actually useful. I can see which links perform best." },
              { name: "Alex R.", role: "Artist", text: "The themes are beautiful. Took me 30 seconds to set up my page." },
            ].map((t, i) => (
              <div
                key={`${setIdx}-${i}`}
                style={{
                  width: 320,
                  padding: 24,
                  margin: "0 12px",
                  background: "#0D1117",
                  border: "1px solid #1E293B",
                  borderRadius: 16,
                  flexShrink: 0,
                }}
              >
                <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 16 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #A78BFA, #F472B6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Simple, transparent pricing</h2>
            <p style={{ color: "#64748B", fontSize: 16 }}>Start free. Upgrade when you need more.</p>
          </div>

          <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {[
              { name: "Free Forever", price: "$0", period: "forever", features: ["1 bio page", "Unlimited links", "Page views counter", "3 classic themes", "Auraix branding"], cta: "Get Started", highlight: false, productId: "free" },
              { name: "Paid (Pro)", price: "$9", period: "/month", features: ["Unlimited bio pages", "All 15+ premium themes", "Animated background effects", "Custom colors & fonts", "Remove branding", "Priority support"], cta: "Upgrade to Pro", highlight: true, productId: "pdt_0NbH8qheEqFDGTInPAlTP" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`hover-lift ${plan.highlight ? "gradient-border" : ""}`}
                style={{
                  background: plan.highlight ? "#0F1729" : "#0D1117",
                  border: plan.highlight ? "none" : "1px solid #1E293B",
                  borderRadius: 20,
                  padding: 36,
                  position: "relative",
                  textAlign: "center",
                }}
              >
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #A78BFA, #F472B6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>Most Popular</div>
                )}
                <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, color: "#F1F5F9" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", color: "#F1F5F9" }}>{plan.price}</span>
                  <span style={{ color: "#64748B", fontSize: 14 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, textAlign: "left" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8", padding: "7px 0" }}>
                      <Check size={15} color="#A78BFA" style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <PricingButton 
                  productId={plan.productId} 
                  cta={plan.cta} 
                  highlight={plan.highlight} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ color: "#64748B", fontSize: 16 }}>Everything you need to know about the platform.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "How does the AI Bio Generator work?", a: "Simply enter your social media handle or a brief description of what you do, and our integrated AI will craft a professional, engaging bio specifically optimized for link-in-bio pages." },
              { q: "Can I use my own custom domain?", a: "Yes! Our Business plan allows you to map your own custom domain (e.g., links.yourname.com) directly to your bio page for a fully white-labeled experience." },
              { q: "Are the analytics real-time?", a: "Absolutely. You can track every page view and link click in real-time right from your dashboard. We also provide historical data breakdowns." },
              { q: "Can I try Pro features before paying?", a: "We offer a 14-day money-back guarantee. You can upgrade to Pro, test out all the advanced themes and analytics, and if you don't love it, we'll refund you." }
            ].map((faq, i) => (
              <details key={i} className="reveal" style={{ background: "#050508", border: "1px solid #1E293B", padding: "20px 24px", borderRadius: 16, cursor: "pointer" }}>
                <summary style={{ fontSize: 18, fontWeight: 600, color: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", listStyle: "none" }}>
                  {faq.q}
                  <ChevronDown className="faq-icon" size={20} color="#94A3B8" />
                </summary>
                <div style={{ paddingTop: 16, color: "#94A3B8", lineHeight: 1.7, fontSize: 15 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>



      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #1E293B", padding: "60px 24px", background: "#030107" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src="/logo.png" alt="Auraix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 24, color: "#F1F5F9", letterSpacing: "-0.02em" }}>Auraix</span>
          </div>

          <p style={{ color: "#64748B", fontSize: 14, textAlign: "center", maxWidth: 400 }}>
            Empowering creators with a stunning, AI-powered digital presence. Your identity, simplified.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 8 }}>
            <a href="https://www.instagram.com/entrext.labs/" target="_blank" rel="noopener noreferrer" style={{ color: "#94A3B8", transition: "color 0.2s" }} className="hover-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="http://linkedin.com/company/entrext/" target="_blank" rel="noopener noreferrer" style={{ color: "#94A3B8", transition: "color 0.2s" }} className="hover-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noopener noreferrer" style={{ color: "#94A3B8", transition: "color 0.2s" }} className="hover-glow">
              <MessageCircle size={22} />
            </a>
            <a href="https://entrextlabs.substack.com/subscribe" target="_blank" rel="noopener noreferrer" style={{ color: "#94A3B8", transition: "color 0.2s" }} className="hover-glow">
              <Newspaper size={22} />
            </a>
          </div>

          <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", marginTop: 24, marginBottom: 8 }} />

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/terms" style={{ color: "#64748B", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} className="hover-glow">Terms & Conditions</Link>
            <Link href="/privacy" style={{ color: "#64748B", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} className="hover-glow">Privacy Policy</Link>
            <Link href="/cookie" style={{ color: "#64748B", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} className="hover-glow">Cookie Policy</Link>
          </div>

          <p style={{ color: "#475569", fontSize: 13, textAlign: "center", marginTop: 8 }}>
            © {new Date().getFullYear()} Auraix. All rights reserved.
          </p>
        </div>
      </footer>
      <UpvoteWidget userId={userId} email={email} />
    </div>
  );
}