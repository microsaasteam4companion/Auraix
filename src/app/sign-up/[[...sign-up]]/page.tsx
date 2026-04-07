import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#06080F",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG Blobs */}
      <div style={{ position: "absolute", top: "15%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="animate-scale-in" style={{ position: "relative", zIndex: 1 }}>
        <SignUp
          forceRedirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
