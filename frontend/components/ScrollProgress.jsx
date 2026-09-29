'use client';

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from './SmoothScroll';

const SIZE = 52;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setPercent(Math.round(v * 100)));

  return (
    <motion.button
      type="button"
      onClick={() => scrollToTarget(0)}
      style={{ opacity }}
      aria-label={`Scroll to top (${percent}% scrolled)`}
      className="glass group fixed bottom-5 right-5 z-40 grid h-[52px] w-[52px] place-items-center rounded-full hover:shadow-glow sm:bottom-6 sm:right-6"
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="progress-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" />
            <stop offset="100%" stopColor="rgb(var(--accent-2))" />
          </linearGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgb(var(--accent) / 0.15)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="url(#progress-ring)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      </svg>
      <span className="relative font-mono text-[10px] font-semibold text-accent-ink transition-opacity duration-200 group-hover:opacity-0">
        {percent}%
      </span>
      <ArrowUp
        size={18}
        aria-hidden="true"
        className="absolute text-accent-ink opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </motion.button>
  );
}
