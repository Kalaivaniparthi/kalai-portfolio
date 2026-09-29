'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const layouts = {
  left: [
    { pos: 'left-[-10%] top-[10%] h-[420px] w-[420px]', color: '--accent', speed: 120 },
    { pos: 'right-[-5%] bottom-[5%] h-[320px] w-[320px]', color: '--accent-3', speed: -80 },
  ],
  right: [
    { pos: 'right-[-10%] top-[5%] h-[420px] w-[420px]', color: '--accent-2', speed: 120 },
    { pos: 'left-[-5%] bottom-[10%] h-[300px] w-[300px]', color: '--accent', speed: -70 },
  ],
  center: [
    { pos: 'left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2', color: '--accent', speed: 100 },
    { pos: 'right-[5%] bottom-0 h-[260px] w-[260px]', color: '--accent-2', speed: -90 },
  ],
};

/**
 * Parallax background layer for a section: soft blurred orbs that move at a different
 * speed from the foreground as you scroll. Parent must be `relative isolate`.
 */
export default function SectionBackdrop({ variant = 'left' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const orbs = layouts[variant];
  const y0 = useTransform(scrollYProgress, [0, 1], [-orbs[0].speed, orbs[0].speed]);
  const y1 = useTransform(scrollYProgress, [0, 1], [-orbs[1].speed, orbs[1].speed]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          style={{ y: i === 0 ? y0 : y1, background: `rgb(var(${o.color}) / 0.14)` }}
          className={`absolute rounded-full blur-[100px] ${o.pos}`}
        />
      ))}
    </div>
  );
}
