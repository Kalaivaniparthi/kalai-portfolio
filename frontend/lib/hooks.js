'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// 3D scene palettes per theme
export const scenePalette = {
  dark: {
    primary: '#00ffff',
    secondary: '#a855f7', // accent connections / orbit ring
    signal: '#ffffff',
    particle: '#00ffff',
    emissive: 0.5,
    lineOpacity: 0.28,
    additive: true,
  },
  light: {
    primary: '#a78bfa', // pastel purple nodes + lines
    secondary: '#f9a8d4', // blush pink accent connections
    signal: '#f472b6',
    particle: '#a78bfa',
    emissive: 0.2,
    lineOpacity: 0.55,
    additive: false,
  },
};

export function useScenePalette() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light' ? scenePalette.light : scenePalette.dark;
}

/** Returns false if the browser cannot create a WebGL context. `null` while checking. */
export function useWebGLSupport() {
  const [supported, setSupported] = useState(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(!!gl);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

/** True while `ref` is on screen — used to pause 3D render loops off-screen. */
export function useInView(ref, rootMargin = '100px') {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Reactive matchMedia. Returns `fallback` during SSR / first render. */
export function useMediaQuery(query, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Phones / tablets / touch-first devices: lighter effects, no cursor-driven effects. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px), (pointer: coarse)');

/** Precise pointer that can hover (mouse / trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
