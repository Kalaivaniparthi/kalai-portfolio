'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';
import { useIsMobile, usePrefersReducedMotion, useWebGLSupport } from '@/lib/hooks';

// Heavy three.js code is split out and only fetched in the browser
const ParticlesScene = dynamic(() => import('./three/ParticlesScene'), { ssr: false, loading: () => null });

/**
 * Full-page layer of slowly drifting glowing particles (fixed, behind all content).
 * 600 particles on desktop, 100 on mobile. Mounted after the browser goes idle so it never
 * competes with the hero for the first paint.
 */
export default function ParticlesBackground() {
  const webgl = useWebGLSupport();
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 600));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = ric(() => setIdle(true), { timeout: 2000 });
    return () => cancel(id);
  }, []);

  if (!webgl || !idle) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[1] animate-[fadeIn_1.2s_ease_forwards]">
      <ErrorBoundary fallback={null}>
        <ParticlesScene count={mobile ? 100 : 600} animate={!reduced} />
      </ErrorBoundary>
    </div>
  );
}
