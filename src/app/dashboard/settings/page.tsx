"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { User, CreditCard, Check, ArrowUpRight } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import { PLAN_LIMITS } from "@/lib/plans";
import type { UserProfile } from "@/types";
import PricingButton from "@/components/PricingButton";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastContext";

function SettingsContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const uId = user?.id;
      if (!uId) return;
      const p = await getUserProfile(uId);
      if (p) {
        setProfile(p);
        setDisplayName(p.displayName || user?.fullName || "");
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    if (searchParams?.get("upgrade") === "success") {
      toast("Welcome to Pro! Your account has been upgraded.", "success");
      // Clean up URL if possible (optional)
    }
  }, [searchParams, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.id, { displayName } as Partial<UserProfile>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const currentPlan = PLAN_LIMITS[profile?.plan || "free"];

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Settings</h1>

      {/* Profile Section */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <User size={18} color="var(--accent)" />
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Profile</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: user?.imageUrl
                ? `url(${user.imageUrl}) center/cover`
                : "linear-gradient(135deg, #10B981, #06B6D4)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{user?.fullName}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>

        <label style={{ display: "block", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
            Display Name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 400,
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
            }}
          />
        </label>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: saved ? "var(--success)" : "var(--accent)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {saved ? (
            <>
              <Check size={14} /> Saved
            </>
          ) : (
            saving ? "Saving..." : "Save Changes"
          )}
        </button>
      </div>

      {/* Billing Section */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <CreditCard size={18} color="var(--accent)" />
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Subscription & Billing</h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--accent-light)",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
              {currentPlan.name} Plan
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {currentPlan.price === 0 ? "Free forever" : `$${currentPlan.price}/month`}
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "var(--accent)",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Current
          </div>
        </div>

        {/* Plan Comparison */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>Feature</th>
                {Object.entries(PLAN_LIMITS).map(([key, plan]) => (
                  <th
                    key={key}
                    style={{
                      textAlign: "center",
                      padding: "10px 12px",
                      fontWeight: 600,
                      color: profile?.plan === key ? "var(--accent)" : "var(--text-secondary)",
                      borderBottom: "1px solid var(--border-subtle)",
                      width: "33%",
                    }}
                  >
                    {plan.name}
                    {profile?.plan === key && (
                      <span style={{ marginLeft: 4, color: "var(--accent)", fontSize: 10 }}>● CURRENT</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Bio Pages", key: "pages" },
                { label: "Analytics", key: "analytics" },
                { label: "Custom Domain", key: "customDomain" },
                { label: "Remove Branding", key: "removeBranding" },
                { label: "Themes", key: "themes" },
                { label: "Price", key: "price" },
              ].map((row) => (
                <tr key={row.key}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    {row.label}
                  </td>
                  {Object.entries(PLAN_LIMITS).map(([key, plan]) => {
                    const val = plan[row.key as keyof typeof plan];
                    let display: string;
                    if (typeof val === "boolean") display = val ? "✓" : "—";
                    else if (row.key === "price") display = val === 0 ? "Free" : `$${val}/mo`;
                    else display = String(val);
                    return (
                      <td
                        key={key}
                        style={{
                          textAlign: "center",
                          padding: "10px 12px",
                          borderBottom: "1px solid var(--border-subtle)",
                          color: typeof val === "boolean" ? (val ? "var(--success)" : "var(--text-muted)") : "var(--text-primary)",
                          fontWeight: typeof val === "boolean" && val ? 700 : 400,
                        }}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {profile?.plan === "free" && (
          <div style={{ marginTop: 20, textAlign: "center", maxWidth: 300, margin: "20px auto 0" }}>
            <PricingButton
              productId={PLAN_LIMITS.pro.productId}
              cta={`Upgrade to Pro — $${PLAN_LIMITS.pro.price}/mo`}
              highlight={true}
            />
          </div>
        )}

        {/* Purchase Details (if Pro) */}
        {profile?.plan === "pro" && (profile.paymentId || profile.subscriptionId) && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Purchase Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Order / Subscription ID</span>
                <code style={{ fontSize: 12, background: "var(--bg-secondary)", padding: "4px 8px", borderRadius: 4, color: "var(--accent)", border: "1px solid var(--border-subtle)" }}>
                  {profile.paymentId || profile.subscriptionId}
                </code>
              </div>
              {profile.planUpdatedAt && (
                <div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Last Upgraded</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {new Date((profile.planUpdatedAt as any)?.seconds ? (profile.planUpdatedAt as any).seconds * 1000 : profile.planUpdatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
              Need help with your purchase? Contact support with your ID above.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
        Loading settings...
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
