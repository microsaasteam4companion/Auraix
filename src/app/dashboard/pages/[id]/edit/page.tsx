"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Save,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
  ArrowLeft,
  QrCode,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getBioPage, updateBioPage, isSlugAvailable, getUserProfile } from "@/lib/firestore";
import { uploadProfileImage } from "@/lib/storage";
import { generateId, slugify, getDisplayDomain } from "@/lib/utils";
import type { BioPage, BioLink, ThemeName, UserProfile } from "@/types";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/components/ui/ToastContext";
import DynamicBackground from "@/components/DynamicBackground";


const PRO_LOCK_ICON = (
  <div style={{ position: "absolute", top: 4, right: 4, background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4, zIndex: 10 }}>PRO</div>
);


const THEMES: { name: ThemeName; label: string; colors: string[]; category: string }[] = [
  // Classic
  { name: "light", label: "Light", colors: ["#FFFFFF", "#F3F4F6", "#6366F1"], category: "Classic" },
  { name: "dark", label: "Dark", colors: ["#111827", "#1F2937", "#818CF8"], category: "Classic" },
  { name: "minimal", label: "Minimal", colors: ["#FAFAFA", "#E5E7EB", "#374151"], category: "Classic" },
  { name: "basics", label: "Basics", colors: ["#FFFFFF", "#E5E5E5", "#000000"], category: "Classic" },
  { name: "carbon", label: "Carbon", colors: ["#0A0A0A", "#171717", "#FAFAFA"], category: "Classic" },
  
  // Live
  { name: "glassy", label: "Glassy", colors: ["#FDF2F8", "#FFE4E6", "#881337"], category: "Live" },
  { name: "neon", label: "Neon", colors: ["#0F172A", "#1E293B", "#7C3AED"], category: "Live" },
  { name: "winter", label: "Winter", colors: ["#E0F2FE", "#7DD3FC", "#0C4A6E"], category: "Live" },
  { name: "rainynight", label: "Rainy", colors: ["#020617", "#1E293B", "#F8FAFC"], category: "Live" },
  { name: "chameleon", label: "Chameleon", colors: ["#064E3B", "#059669", "#FFFFFF"], category: "Live" },

  // Special
  { name: "pride", label: "Pride", colors: ["#FF0000", "#FF7F00", "#FFFF00"], category: "Special" },
  { name: "glitch", label: "Glitch", colors: ["#FFFFFF", "#000000", "#00FF00"], category: "Special" },
  { name: "retro", label: "Retro", colors: ["#F5F5DC", "#4B2E2E", "#8B4513"], category: "Special" },
  { name: "summer", label: "Summer", colors: ["#0EA5E9", "#FDE047", "#164E63"], category: "Special" },
  { name: "christmas", label: "Festive", colors: ["#064E3B", "#065F46", "#FFFFFF"], category: "Special" },
];

const FONTS = [
  { name: "var(--font-sans)", label: "Modern Sans" },
  { name: "'Inter', sans-serif", label: "Inter" },
  { name: "'Geist Mono', monospace", label: "Mono" },
  { name: "'Playfair Display', serif", label: "Elegant" },
  { name: "'Montserrat', sans-serif", label: "Bold" },
];

const BUTTON_STYLES: { id: "pill" | "rounded" | "square" | "outline" | "glass"; label: string }[] = [
  { id: "pill", label: "Pill" },
  { id: "rounded", label: "Rounded" },
  { id: "square", label: "Square" },
  { id: "outline", label: "Outline" },
  { id: "glass", label: "Glass" },
];

const BG_EFFECTS: { id: "none" | "aurora" | "particles" | "mesh" | "snow" | "rain"; label: string }[] = [
  { id: "none", label: "None" },
  { id: "aurora", label: "Aurora" },
  { id: "particles", label: "Particles" },
  { id: "mesh", label: "Mesh" },
  { id: "snow", label: "Snow" },
  { id: "rain", label: "Rain" },
];

const TEMPLATES = [
  {
    id: "creator",
    name: "Digital Creator",
    bio: "Passionate digital creator sharing insights on tech, design, and lifestyle. Follow my journey!",
    links: [
      { id: "1", title: "Latest YouTube Video", url: "https://youtube.com", clicks: 0 },
      { id: "2", title: "My Newsletter", url: "https://substack.com", clicks: 0 },
      { id: "3", title: "Instagram", url: "https://instagram.com", clicks: 0 },
    ],
    theme: "dark" as ThemeName,
    buttonStyle: "pill" as const,
  },
  {
    id: "developer",
    name: "Software Engineer",
    bio: "Building the future with code. Open source contributor and tech enthusiast.",
    links: [
      { id: "1", title: "GitHub Projects", url: "https://github.com", clicks: 0 },
      { id: "2", title: "Technical Blog", url: "https://dev.to", clicks: 0 },
      { id: "3", title: "LinkedIn", url: "https://linkedin.com", clicks: 0 },
    ],
    theme: "minimal" as ThemeName,
    buttonStyle: "rounded" as const,
  },
  {
    id: "business",
    name: "Business / Brand",
    bio: "Helping brands grow with strategic marketing and innovative solutions.",
    links: [
      { id: "1", title: "Our Services", url: "https://example.com/services", clicks: 0 },
      { id: "2", title: "Book a Consultation", url: "https://calendly.com", clicks: 0 },
      { id: "3", title: "Client Testimonials", url: "https://example.com/reviews", clicks: 0 },
    ],
    theme: "classic" as ThemeName,
    buttonStyle: "square" as const,
  },
];

function SortableLink({
  link,
  onUpdate,
  onRemove,
}: {
  link: BioLink;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "10px 12px",
        marginBottom: 8,
      }}
    >
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "var(--text-muted)" }}>
        <GripVertical size={16} />
      </div>
      <input
        type="text"
        placeholder="Title"
        value={link.title}
        onChange={(e) => onUpdate(link.id, "title", e.target.value)}
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          fontSize: 13,
          outline: "none",
          minWidth: 0,
        }}
      />
      <input
        type="url"
        placeholder="https://..."
        value={link.url}
        onChange={(e) => onUpdate(link.id, "url", e.target.value)}
        style={{
          flex: 2,
          padding: "8px 10px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          fontSize: 13,
          outline: "none",
          minWidth: 0,
        }}
      />
      <button
        onClick={() => onRemove(link.id)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          borderRadius: "var(--radius-sm)",
          border: "none",
          background: "transparent",
          color: "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default function EditPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id: pageId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [page, setPage] = useState<BioPage | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [links, setLinks] = useState<BioLink[]>([]);
  const [theme, setTheme] = useState<ThemeName>("light");
  const [fontFamily, setFontFamily] = useState(FONTS[0].name);
  const [buttonStyle, setButtonStyle] = useState<"pill" | "rounded" | "square" | "outline" | "glass">("rounded");
  const [backgroundEffect, setBackgroundEffect] = useState<"none" | "aurora" | "particles" | "mesh" | "snow" | "rain">("none");
  const [isPublished, setIsPublished] = useState(true);

  // AI Bio
  const [aiHandle, setAiHandle] = useState("");
  const [aiPlatform, setAiPlatform] = useState("twitter");
  const [aiTone, setAiTone] = useState("professional");
  const [showAiPanel, setShowAiPanel] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const uProfile = await getUserProfile(user.id);
          setProfile(uProfile);
        }
        const data = await getBioPage(pageId);
        if (data) {
          setPage(data);
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || "");
          setLinks(data.links || []);
          setTheme(data.theme || "light");
          setFontFamily(data.fontFamily || FONTS[0].name);
          setButtonStyle(data.buttonStyle || "rounded");
          setBackgroundEffect((data.backgroundEffect as any) || "none");
          setIsPublished(data.isPublished);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user) load();
  }, [pageId, user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingImage(true);
    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 400 });
      const url = await uploadProfileImage(user.id, compressed);
      setPhotoURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    const t = TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    setDisplayName(t.name);
    setBio(t.bio);
    setLinks(t.links.map(l => ({ ...l, id: generateId() })));
    setTheme(t.theme);
    setButtonStyle(t.buttonStyle);
    if (t.id === "creator") setBackgroundEffect("aurora");
  };

  const generateBio = async () => {
    if (!aiHandle.trim()) return;
    setGeneratingBio(true);
    try {
      const res = await fetch("/api/grok/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: aiHandle, platform: aiPlatform, tone: aiTone }),
      });
      const data = await res.json();
      if (data.bio) {
        setBio(data.bio);
        setShowAiPanel(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingBio(false);
    }
  };


  const addLink = () => setLinks((prev) => [...prev, { id: generateId(), title: "", url: "", clicks: 0 }]);
  const updateLink = (id: string, field: string, value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((prev) => {
        const oldIndex = prev.findIndex((l) => l.id === active.id);
        const newIndex = prev.findIndex((l) => l.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };


  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await updateBioPage(pageId, {
        displayName,
        bio,
        photoURL,
        links: links.filter((l) => l.title && l.url),
        theme,
        fontFamily,
        buttonStyle,
        backgroundEffect,
        isPublished,
        title: displayName,
      });
      toast("Page updated successfully!", "success");
      router.push("/dashboard/pages");
    } catch (err) {
      console.error(err);
      toast("Failed to update page.", "error");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Loader2 size={32} color="var(--accent)" />
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Page not found</h2>
        <Link href="/dashboard/pages" style={{ color: "var(--accent)", marginTop: 12, display: "inline-block" }}>
          ← Back to pages
        </Link>
      </div>
    );
  }

  const themePreviewStyles = getThemePreviewStyles(theme, fontFamily, buttonStyle);
  const pageUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${page.slug}`;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/dashboard/pages"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Edit: {page.slug}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowQR(!showQR)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <QrCode size={15} /> QR
          </button>
          <button
            onClick={() => setIsPublished(!isPublished)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
            {isPublished ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? <Loader2 size={15} /> : <Save size={15} />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div
          className="animate-scale-in"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>QR Code for /{page.slug}</h3>
          <div id="qr-code-container" style={{ display: "inline-block", padding: 16, background: "#fff", borderRadius: "var(--radius-md)" }}>
            <QRCodeSVG value={pageUrl} size={180} level="H" />
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => {
                const svg = document.querySelector("#qr-code-container svg") as SVGElement;
                if (!svg) return;
                
                const svgData = new XMLSerializer().serializeToString(svg);
                const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                
                canvas.width = 1000;
                canvas.height = 1000;

                const img = new Image();
                img.onload = () => {
                  ctx.fillStyle = "white";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  const padding = 100;
                  ctx.drawImage(img, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
                  
                  const pngUrl = canvas.toDataURL("image/png");
                  const downloadLink = document.createElement("a");
                  downloadLink.download = `Auraix-${page.slug}-qr.png`;
                  downloadLink.href = pngUrl;
                  downloadLink.click();
                  URL.revokeObjectURL(url);
                };
                img.src = url;
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Download PNG
            </button>
          </div>
        </div>
      )}

      {/* Editor Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="editor-grid">
        {/* Left: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Profile */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Profile</h2>

            {/* Templates */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                Start from a Template (Overwrites current)
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-secondary)",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: photoURL ? `url(${photoURL}) center/cover` : "linear-gradient(135deg, var(--accent), #8B5CF6)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!photoURL && <ImageIcon size={24} color="#fff" />}
              </div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                {uploadingImage ? <Loader2 size={14} /> : <ImageIcon size={14} />}
                {uploadingImage ? "Uploading..." : "Change Photo"}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            </div>
            <label style={{ display: "block", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Display Name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none" }}
              />
            </label>
            <label style={{ display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Bio</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{bio.length}/300</span>
                  <button onClick={() => setShowAiPanel(!showAiPanel)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: "var(--radius-full)", border: "none", background: "var(--accent-light)", color: "var(--accent)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <Sparkles size={12} /> AI
                  </button>
                </div>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
              />
            </label>
            {showAiPanel && (
              <div className="animate-scale-in" style={{ background: "var(--accent-light)", border: "1px solid var(--accent-muted)", borderRadius: "var(--radius-md)", padding: 16, marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <input type="text" value={aiHandle} onChange={(e) => setAiHandle(e.target.value)} placeholder="@handle" style={{ flex: 2, minWidth: 120, padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  <select value={aiPlatform} onChange={(e) => setAiPlatform(e.target.value)} style={{ flex: 1, minWidth: 90, padding: "8px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13 }}>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={aiTone} onChange={(e) => setAiTone(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13 }}>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="witty">Witty</option>
                    <option value="inspirational">Inspirational</option>
                  </select>
                  <button onClick={generateBio} disabled={generatingBio} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: generatingBio ? "wait" : "pointer", whiteSpace: "nowrap" }}>
                    {generatingBio ? <Loader2 size={14} /> : <Sparkles size={14} />}
                    {generatingBio ? "..." : "Generate"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Links</h2>
              <button onClick={addLink} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-md)", border: "none", background: "var(--accent-light)", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <Plus size={14} /> Add
              </button>
            </div>
            {links.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "var(--text-muted)", fontSize: 14 }}>No links yet.</div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                  {links.map((link) => (
                    <SortableLink key={link.id} link={link} onUpdate={updateLink} onRemove={removeLink} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Themes */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Theme</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 24 }}>
              {["Classic", "Live", "Special"].map((cat) => (
                <div key={cat}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{cat}</h3>
                    {cat === "Live" && <span style={{ padding: "2px 6px", borderRadius: 4, background: "var(--accent-light)", color: "var(--accent)", fontSize: 10, fontWeight: 700 }}>ANIMATED</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                    {THEMES.filter(t => t.category === cat).map((t) => {
                      const isLocked = profile?.plan === "free" && cat !== "Classic";
                      return (
                        <button 
                          key={t.name} 
                          onClick={() => {
                            if (isLocked) {
                              toast("Upgrade to Pro to use premium themes!", "error");
                              return;
                            }
                            setTheme(t.name);
                          }} 
                          style={{ 
                            padding: "12px 8px", 
                            borderRadius: "var(--radius-md)", 
                            border: theme === t.name ? "2px solid var(--accent)" : "1px solid var(--border-subtle)", 
                            background: "var(--bg-secondary)", 
                            cursor: "pointer", 
                            textAlign: "center",
                            transition: "all 0.2s ease",
                            position: "relative",
                            opacity: isLocked ? 0.7 : 1,
                          }}
                        >
                          {isLocked && PRO_LOCK_ICON}
                          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
                            {t.colors.map((c, i) => (
                              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.05)" }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: theme === t.name ? "var(--text-primary)" : "var(--text-secondary)" }}>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Styling */}
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>Advanced Styling</h3>
            
            {/* Fonts */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Font Family</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FONTS.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setFontFamily(f.name)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "var(--radius-full)",
                      border: fontFamily === f.name ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                      background: fontFamily === f.name ? "var(--accent-light)" : "var(--bg-secondary)",
                      color: fontFamily === f.name ? "var(--accent)" : "var(--text-primary)",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: f.name === "var(--font-sans)" ? "inherit" : f.name
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Button Style</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {BUTTON_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setButtonStyle(s.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: s.id === "pill" ? "9999px" : s.id === "rounded" ? "8px" : "2px",
                      border: buttonStyle === s.id ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                      background: buttonStyle === s.id ? "var(--accent-light)" : "var(--bg-secondary)",
                      color: buttonStyle === s.id ? "var(--accent)" : "var(--text-primary)",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Effect */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Background Effect</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {BG_EFFECTS.map(e => {
                  const isLocked = profile?.plan === "free" && e.id !== "none";
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        if (isLocked) {
                          toast("Upgrade to Pro to use background effects!", "error");
                          return;
                        }
                        setBackgroundEffect(e.id);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                        border: backgroundEffect === e.id ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                        background: backgroundEffect === e.id ? "var(--accent-light)" : "var(--bg-secondary)",
                        color: backgroundEffect === e.id ? "var(--accent)" : "var(--text-primary)",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        position: "relative",
                        opacity: isLocked ? 0.7 : 1,
                      }}
                    >
                      {isLocked && PRO_LOCK_ICON}
                      {e.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: "sticky", top: 88 }} className="preview-column">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 16, boxShadow: "var(--shadow-md)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, textAlign: "center" }}>Preview</div>
            <div style={{ width: "100%", maxWidth: 320, margin: "0 auto", borderRadius: 24, border: "2px solid var(--border-subtle)", overflow: "hidden", aspectRatio: "9/18", position: "relative", ...themePreviewStyles.container }}>
              {/* Dynamic Background Preview */}
              <DynamicBackground 
                type={
                  backgroundEffect !== "none" ? backgroundEffect :
                  theme === "winter" ? "snow" :
                  theme === "rainynight" ? "rain" :
                  theme === "chameleon" ? "mesh" :
                  "none"
                }
                isFullPage={false}
              />

              <div style={{ padding: "32px 20px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: photoURL ? `url(${photoURL}) center/cover` : "linear-gradient(135deg, var(--accent), #8B5CF6)", margin: "0 auto 12px", border: "3px solid rgba(255,255,255,0.2)" }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, ...themePreviewStyles.text }}>{displayName || "Your Name"}</div>
                <div style={{ fontSize: 12, marginBottom: 20, lineHeight: 1.5, ...themePreviewStyles.mutedText }}>{bio || "Bio..."}</div>
                {links.filter((l) => l.title).map((link) => {
                  const ytMatch = link.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                  const spMatch = link.url.match(/open\.spotify\.com\/(track|album|playlist|show|episode)\/([a-zA-Z0-9]+)/);

                  return (
                    <div key={link.id} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8, width: "100%" }}>
                      {ytMatch && (
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: themePreviewStyles.link.borderRadius, border: themePreviewStyles.link.border }}>
                          <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} src={`https://www.youtube.com/embed/${ytMatch[1]}`} frameBorder="0" />
                        </div>
                      )}
                      {spMatch && (
                        <iframe style={{ borderRadius: themePreviewStyles.link.borderRadius, border: themePreviewStyles.link.border }} src={`https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}?utm_source=generator`} width="100%" height={spMatch[1] === 'track' ? "80" : "152"} frameBorder="0" />
                      )}
                      <div
                        style={{
                          padding: "10px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          textAlign: "center",
                          ...themePreviewStyles.link,
                          marginBottom: 0,
                        }}
                      >
                        {link.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .editor-grid { grid-template-columns: 1fr !important; }
          .preview-column { position: static !important; order: -1; }
        }
      `}</style>
    </div>
  );
}

function getThemePreviewStyles(theme: ThemeName, fontFamily?: string, buttonStyle?: string) {
  const themes: Record<ThemeName, { container: React.CSSProperties; text: React.CSSProperties; mutedText: React.CSSProperties; link: React.CSSProperties }> = {
    light: {
      container: { background: "#FFFFFF", fontFamily: fontFamily || "inherit" },
      text: { color: "#111827" },
      mutedText: { color: "#6B7280" },
      link: { 
        background: "#F3F4F6", 
        color: "#111827", 
        border: buttonStyle === "outline" ? "1px solid #111827" : "1px solid #E5E7EB",
        borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "rounded" ? "8px" : "2px"
      },
    },
    dark: {
      container: { background: "#111827", fontFamily: fontFamily || "inherit" },
      text: { color: "#F9FAFB" },
      mutedText: { color: "#9CA3AF" },
      link: { 
        background: buttonStyle === "outline" ? "transparent" : "#1F2937", 
        color: "#F3F4F6", 
        border: buttonStyle === "outline" ? "1px solid #F3F4F6" : "1px solid #374151",
        borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "rounded" ? "8px" : "2px"
      },
    },
    minimal: {
      container: { background: "#FAFAFA", fontFamily: fontFamily || "inherit" },
      text: { color: "#374151" },
      mutedText: { color: "#6B7280" },
      link: { 
        background: "transparent", 
        color: "#374151", 
        border: "1px solid #D1D5DB",
        borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "rounded" ? "8px" : "2px"
      },
    },
    soft: {
      container: { background: "#FFF7ED", fontFamily: fontFamily || "inherit" },
      text: { color: "#7C2D12" },
      mutedText: { color: "#A16207" },
      link: { 
        background: "#FED7AA", 
        color: "#7C2D12", 
        border: "1px solid #FDBA74",
        borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "rounded" ? "8px" : "2px"
      },
    },
    classic: {
      container: { background: "#F8FAFC", fontFamily: fontFamily || "inherit" },
      text: { color: "#1E293B" },
      mutedText: { color: "#64748B" },
      link: { 
        background: "#1E293B", 
        color: "#F8FAFC", 
        border: "none",
        borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "rounded" ? "12px" : "4px"
      },
    },
    basics: {
      container: { background: "#FFFFFF", fontFamily: fontFamily || "inherit" },
      text: { color: "#000000" },
      mutedText: { color: "#737373" },
      link: { background: "#FFFFFF", color: "#000000", border: "1px solid #E5E5E5", borderRadius: "4px" },
    },
    carbon: {
      container: { background: "#0A0A0A", fontFamily: fontFamily || "inherit" },
      text: { color: "#FAFAFA" },
      mutedText: { color: "#737373" },
      link: { background: "#171717", color: "#FAFAFA", border: "1px solid #262626", borderRadius: "4px" },
    },
    christmas: {
      container: { background: "#064E3B", fontFamily: fontFamily || "inherit" },
      text: { color: "#FFFFFF" },
      mutedText: { color: "#D1FAE5" },
      link: { background: "#065F46", color: "#FFFFFF", border: "1px solid #059669", borderRadius: "4px" },
    },
    pride: {
      container: { background: "linear-gradient(180deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)", fontFamily: fontFamily || "inherit" },
      text: { color: "#FFFFFF" },
      mutedText: { color: "rgba(255,255,255,0.8)" },
      link: { background: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px" },
    },
    winter: {
      container: { background: "linear-gradient(180deg, #E0F2FE, #7DD3FC)", fontFamily: fontFamily || "inherit" },
      text: { color: "#0C4A6E" },
      mutedText: { color: "#0369A1" },
      link: { background: "rgba(255,255,255,0.4)", color: "#0C4A6E", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "12px" },
    },
    glassy: {
      container: { background: "linear-gradient(135deg, #FDF2F8, #FFE4E6)", fontFamily: fontFamily || "inherit" },
      text: { color: "#881337" },
      mutedText: { color: "#BE123C" },
      link: { background: "rgba(255,255,255,0.3)", color: "#881337", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "20px" },
    },
    neon: {
      container: { background: "#0F172A", fontFamily: fontFamily || "inherit" },
      text: { color: "#F1F5F9" },
      mutedText: { color: "#94A3B8" },
      link: { background: "#1E293B", color: "#F1F5F9", border: "1px solid #7C3AED", borderRadius: "20px" },
    },
    rainynight: {
      container: { background: "#020617", fontFamily: fontFamily || "inherit" },
      text: { color: "#F8FAFC" },
      mutedText: { color: "#64748B" },
      link: { background: "rgba(30, 41, 59, 0.5)", color: "#F8FAFC", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: "12px" },
    },
    retro: {
      container: { background: "#F5F5DC", fontFamily: fontFamily || "inherit" },
      text: { color: "#4B2E2E" },
      mutedText: { color: "#8B4513" },
      link: { background: "#FFFFFF", color: "#4B2E2E", border: "2px solid #4B2E2E", borderRadius: "0px" },
    },
    summer: {
      container: { background: "#0EA5E9", fontFamily: fontFamily || "inherit" },
      text: { color: "#FFFFFF" },
      mutedText: { color: "#E0F2FE" },
      link: { background: "#FDE047", color: "#164E63", border: "none", borderRadius: "9999px" },
    },
    glitch: {
      container: { background: "#FFFFFF", fontFamily: fontFamily || "inherit" },
      text: { color: "#000000" },
      mutedText: { color: "#666666" },
      link: { background: "#FFFFFF", color: "#000000", border: "2px solid #000000", borderRadius: "4px" },
    },
    chameleon: {
      container: { background: "#064E3B", fontFamily: fontFamily || "inherit" },
      text: { color: "#FFFFFF" },
      mutedText: { color: "#D1FAE5" },
      link: { background: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px" },
    },
  };
  
  const selected = themes[theme];
  if (buttonStyle === "glass") {
    selected.link = {
      ...selected.link,
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "12px"
    };
  }
  
  return selected;
}
