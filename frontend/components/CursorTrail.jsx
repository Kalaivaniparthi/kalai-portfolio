'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useFinePointer, useMediaQuery, usePrefersReducedMotion } from '@/lib/hooks';

const LIFETIME = 1000; // ms — each trail point fades out over 1s
const MAX_POINTS = 60;

const COLORS = {
  dark: [0, 255, 255],
  light: [167, 139, 250],
};

/**
 * Soft glowing cursor trail drawn on a single 2D canvas.
 * The render loop only runs while trail points are alive, so it costs nothing when the mouse is still.
 * Disabled on touch / small screens and for reduced-motion users.
 */
export default function CursorTrail() {
  const canvasRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const colorRef = useRef(COLORS.dark);
  const finePointer = useFinePointer();
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = usePrefersReducedMotion();
  const enabled = finePointer && wide && !reduced;

  useEffect(() => {
    colorRef.current = resolvedTheme === 'light' ? COLORS.light : COLORS.dark;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const points = [];
    let raf = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const now = performance.now();
      while (points.length && now - points[0].t > LIFETIME) points.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const [r, g, b] = colorRef.current;
      ctx.globalCompositeOperation = resolvedTheme === 'light' ? 'source-over' : 'lighter';
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const life = 1 - (now - p.t) / LIFETIME; // 1 → 0
        const radius = 2 + life * 10;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.55 * life})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = points.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (points.length > MAX_POINTS) points.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [enabled, resolvedTheme]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] h-full w-full" />;
}
