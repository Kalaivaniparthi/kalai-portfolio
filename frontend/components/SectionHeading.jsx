'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

export default function SectionHeading({ eyebrow, title, subtitle, id }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mb-12 text-center"
    >
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-ink">
          <span aria-hidden="true">{'// '}</span>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>}
      <div
        aria-hidden="true"
        className="mx-auto mt-5 h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent shadow-glow"
      />
    </motion.div>
  );
}
