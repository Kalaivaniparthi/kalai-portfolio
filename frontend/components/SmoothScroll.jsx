'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis = null;

/** Access the active Lenis instance (null when disabled, e.g. reduced motion). */
export const getLenis = () => lenis;

/** Scroll helper that uses Lenis when active and falls back to native scrolling. */
export function scrollToTarget(target) {
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}

export default function SmoothScroll() {
  useEffect(() => {
    // Respect users who asked for less motion: keep native scrolling
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      anchors: true, // in-page #links glide to their section; sections' scroll-margin-top clears the fixed navbar
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
