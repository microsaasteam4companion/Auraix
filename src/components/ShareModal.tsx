import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageUrl: string;
  slug: string;
}

export default function ShareModal({ isOpen, onClose, pageUrl, slug }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.querySelector("#qr-code-container svg") as SVGElement;
    if (!svg) return;

    // Use a more robust way to capture the SVG content
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution for the PNG (400x400)
    canvas.width = 1000;
    canvas.height = 1000;

    const img = new Image();
    img.onload = () => {
      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code with padding
      const padding = 100;
      ctx.drawImage(img, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
      
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Auraix-${slug}-qr.png`;
      downloadLink.href = pngUrl;
      downloadLink.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal Content */}
      <div
        className="animate-scale-in"
        style={{
          position: "relative",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          border: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Share your page</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
          Anyone with this link or QR code can view your Bio Link.
        </p>

        {/* QR Code */}
        <div
          id="qr-code-container"
          style={{
            display: "inline-flex",
            padding: 20,
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            border: "2px solid var(--border-subtle)",
            marginBottom: 24,
          }}
        >
          <QRCodeSVG value={pageUrl} size={180} level="H" />
        </div>

        {/* Actions Grid */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={16} /> Download
          </button>
          
          <Link
            href={`/${slug}`}
            target="_blank"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={16} /> View Live
          </Link>
        </div>

        {/* Copy Link Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 13,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "left",
            }}
          >
            {pageUrl}
          </div>
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: copied ? "var(--success-light)" : "var(--bg-card)",
              color: copied ? "var(--success)" : "var(--text-primary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
