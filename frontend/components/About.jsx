'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import MorphingBlob from './MorphingBlob';
import NumberCounter from './NumberCounter';
import { currently, site, stats } from '@/lib/data';
import { EASE, revealContainer, revealInView, revealItem } from '@/lib/motion';

function Portrait() {
  const [error, setError] = useState(false);
  return (
    <div className="relative mx-auto aspect-square w-64 sm:w-80">
      {/* Glow ring */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-full opacity-70 blur-xl animate-glow-pulse"
        style={{ background: 'conic-gradient(from 0deg, rgb(var(--accent)), rgb(var(--accent-2)), rgb(var(--accent-3)), rgb(var(--accent)))' }}
      />
      <div
        className="relative h-full w-full overflow-hidden rounded-full p-[3px]"
        style={{ background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)), rgb(var(--accent-3)))' }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full bg-bg transition-colors duration-theme">
          {error ? (
            <div className="grid h-full w-full place-items-center grid-bg" role="img" aria-label={`${site.name} monogram`}>
              <span className="font-display text-7xl font-bold text-gradient">KP</span>
            </div>
          ) : (
            <Image
              src={site.photo}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-cover"
              onError={() => setError(true)}
            />
          )}
        </div>
      </div>
      <div className="glass absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium shadow-glow">
        <span className="text-accent-ink">●</span> Open to opportunities
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate py-24 sm:py-32">
      {/* Morphing pastel blob behind the section */}
      <MorphingBlob className="left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 sm:h-[680px] sm:w-[680px]" />

      <div className="container">
        <SectionHeading id="about-title" eyebrow="About me" title="The human behind the network" />

        <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
          <motion.div variants={revealContainer} {...revealInView}>
            <motion.p variants={revealItem} className="text-lg leading-relaxed text-fg/90">
              {site.bio}
            </motion.p>

            <motion.div variants={revealItem} className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
              <span className="chip gap-1.5">
                <MapPin size={14} aria-hidden="true" /> {site.location}
              </span>
              <span className="chip gap-1.5">
                <GraduationCap size={14} aria-hidden="true" /> B.Tech IT · Agni College of Technology
              </span>
            </motion.div>

            {/* Currently badge */}
            <motion.div variants={revealItem} className="glass glow-hover mt-8 rounded-2xl p-6">
              <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">
                <Sparkles size={14} aria-hidden="true" /> Currently
              </p>
              <ul className="space-y-3">
                {currently.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <span className="text-xl leading-none" aria-hidden="true">
                      {c.emoji}
                    </span>
                    <span>
                      <span className="font-semibold">{c.label}:</span> <span className="text-muted">{c.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Stats with count-up numbers */}
            <motion.dl variants={revealContainer} className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={revealItem}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="glass glow-hover rounded-xl p-4 text-center"
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold text-accent-ink sm:text-4xl">
                    <NumberCounter value={s.value} suffix={s.suffix} />
                  </dd>
                  <dd className="mt-1 text-xs text-muted sm:text-sm" aria-hidden="true">
                    {s.label}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Portrait />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
