'use client';

import { useEffect } from 'react';

/**
 * Clicking anywhere spawns a soft pastel ripple that expands and fades.
 * Uses plain DOM nodes + a CSS animation (no React re-renders). Hidden via CSS for reduced motion.
 */
export default function ClickRipple() {
  useEffect(() => {
    const onDown = (e) => {
      if (e.button !== 0) return;
      const el = document.createElement('span');
      el.className = 'click-ripple';
      el.setAttribute('aria-hidden', 'true');
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.addEventListener('animationend', () => el.remove(), { once: true });
      document.body.appendChild(el);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return null;
}
