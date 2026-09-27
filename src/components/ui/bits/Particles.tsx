/**
 * Fondo de partículas con conexiones sutiles y parallax al cursor.
 * Inspirado en los fondos de React Bits (reactbits.dev), reimplementado
 * aquí en canvas para no depender de WebGL.
 */
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../../lib/utils";

interface ParticlesProps {
  density?: number;
  className?: string;
  linkDistance?: number;
}

export function Particles({ density = 0.00007, className, linkDistance = 120 }: ParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = prefersReducedMotion() || document.documentElement.classList.contains("reduce-motion");
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    type P = { x: number; y: number; vx: number; vy: number; r: number; z: number };
    let pts: P[] = [];

    const color = () => {
      const s = getComputedStyle(document.documentElement);
      return { p: s.getPropertyValue("--primary").trim() || "157 110 255", t: s.getPropertyValue("--text").trim() || "255 255 255" };
    };
    let col = color();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.min(110, Math.round(w * h * density)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.4, z: Math.random() * 0.8 + 0.2,
      }));
    };

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduced) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const ax = a.x + mouse.x * a.z * 18, ay = a.y + mouse.y * a.z * 18;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const bx = b.x + mouse.x * b.z * 18, by = b.y + mouse.y * b.z * 18;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < linkDistance) {
            ctx.strokeStyle = `rgb(${col.p} / ${(1 - d / linkDistance) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          }
        }
        ctx.fillStyle = a.z > 0.7 ? `rgb(${col.p} / 0.85)` : `rgb(${col.t} / ${0.18 + a.z * 0.25})`;
        ctx.beginPath(); ctx.arc(ax, ay, a.r * (0.6 + a.z), 0, Math.PI * 2); ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const mo = new MutationObserver(() => { col = color(); if (reduced) draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize(); draw();
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(); });
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, linkDistance]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
