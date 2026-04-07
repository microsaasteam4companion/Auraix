"use client";

import { useEffect, useRef } from "react";

export default function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles: { x: number; z: number; y: number }[] = [];
    const spacing = 40;
    const rows = 40;
    const cols = 60;
    
    // Initialize particles
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        particles.push({
          x: (j - cols / 2) * spacing,
          z: (i - rows / 2) * spacing,
          y: 0
        });
      }
    }

    let time = 0;
    let reqId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2 + 100; // push down a bit
      const fl = 400; // focal length

      time += 0.02;

      ctx.fillStyle = "#A78BFA"; // Base purple color for particles
      
      // Sort particles by Z so distant ones draw first (basic painter\'s algorithm)
      // Actually, for dots it matters less, but good for overlap if they were larger.
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Calculate wave height
        const distance = Math.sqrt(p.x * p.x + p.z * p.z);
        // Add some complexity to the wave
        p.y = Math.sin(distance * 0.01 - time * 2) * 60 + Math.cos(p.x * 0.02 + time) * 30;

        // Apply 3D rotation (tilt the plane down so we see it as a floor)
        const angleX = 0.5; // tilt angle
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        
        const yRot = p.y * cosX - p.z * sinX;
        const zRot = p.y * sinX + p.z * cosX;

        // Translate Z back
        const zStr = zRot + 800; // move away from camera
        
        if (zStr > 0) {
          const scale = fl / zStr;
          const px = cx + p.x * scale;
          const py = cy + yRot * scale;

          const size = Math.max(0.5, 2.5 * scale);
          const alpha = Math.min(1, Math.max(0, (1500 - zStr) / 1000));
          
          if (px > 0 && px < width && py > 0 && py < height) {
            // Give closer dots a brighter magenta tint, further dots more purple
            const gradientTint = Math.sin(p.x * 0.01 + time) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(${167 + gradientTint * 77}, ${139 - gradientTint * 25}, ${250 - gradientTint * 68}, ${alpha})`;
            
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      reqId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8
      }}
    />
  );
}
