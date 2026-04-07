"use client";

import { useEffect, useRef } from "react";

interface DynamicBackgroundProps {
  type: 'snow' | 'rain' | 'aurora' | 'mesh' | 'particles' | 'none';
  color?: string;
  isFullPage?: boolean;
}

export default function DynamicBackground({ type, color, isFullPage = true }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (isFullPage || !parent) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      } else {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      }
    };

    updateSize();

    let particles: any[] = [];
    let reqId: number;
    let time = 0;

    const initParticles = () => {
      particles = [];
      const count = type === 'snow' ? 100 : type === 'rain' ? 200 : type === 'particles' ? 80 : 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: type === 'snow' ? (Math.random() - 0.5) * 1 : type === 'particles' ? (Math.random() - 0.5) * 0.5 : 0,
          vy: type === 'snow' ? Math.random() * 2 + 1 : type === 'rain' ? Math.random() * 15 + 10 : (Math.random() - 0.5) * 0.5,
          size: type === 'snow' ? Math.random() * 3 + 1 : type === 'rain' ? 1.5 : Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      if (type === 'snow' || type === 'rain' || type === 'particles') {
        ctx.fillStyle = type === 'snow' || type === 'particles' ? "white" : "rgba(186, 230, 253, 0.7)";
        particles.forEach(p => {
          ctx.globalAlpha = p.opacity;
          if (type === 'snow' || type === 'particles') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(p.x, p.y, 1.5, 20);
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.y < -20) p.y = height;
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;
        });
      } else if (type === 'aurora') {
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(0, height * (0.3 + i * 0.15));
          for (let x = 0; x <= width; x += 20) {
            const y = height * (0.3 + i * 0.15) + Math.sin(x * 0.002 + time + i) * 60;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.fillStyle = `rgba(${i === 0 ? '167, 139, 250' : i === 1 ? '139, 92, 246' : '196, 181, 253'}, 0.12)`;
          ctx.fill();
        }
      } else if (type === 'mesh') {
        const gradient = ctx.createRadialGradient(
          width * (0.5 + Math.sin(time) * 0.3),
          height * (0.5 + Math.cos(time) * 0.3),
          0,
          width * 0.5,
          height * 0.5,
          width * 0.9
        );
        gradient.addColorStop(0, color || "rgba(167, 139, 250, 0.4)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      reqId = requestAnimationFrame(render);
    };

    initParticles();
    render();

    const handleResize = () => {
      updateSize();
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
    };
  }, [type, color, isFullPage]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: isFullPage ? "fixed" : "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: type === 'rain' ? 0.6 : type === 'particles' ? 0.5 : 0.8,
      }}
    />
  );
}
