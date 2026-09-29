'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Rocket, Star, Code } from 'lucide-react';
import SectionHeading from './SectionHeading';
import SectionBackdrop from './SectionBackdrop';
import { achievements } from '@/lib/data';
import { revealContainer, revealInView, revealItem } from '@/lib/motion';

const icons = { trophy: Trophy, award: Award, rocket: Rocket, star: Star, code: Code };

export default function Achievements() {
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="relative isolate py-24 sm:py-32">
      <SectionBackdrop variant="right" />
      <div className="container">
        <SectionHeading id="achievements-title" eyebrow="Milestones" title="Achievements" />

        <motion.ul variants={revealContainer} {...revealInView} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = icons[a.icon] ?? Star;
            return (
              <motion.li
                key={a.title}
                variants={revealItem}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`glass group relative overflow-hidden rounded-2xl p-6 hover:border-accent/60 hover:shadow-glow-lg ${
                  a.featured ? 'sm:col-span-2 lg:row-span-2 lg:col-span-1' : a.wide ? 'lg:col-span-2' : ''
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-accent/25 to-accent2/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span
                  className={`relative grid place-items-center rounded-2xl bg-gradient-to-br from-accent/25 to-accent2/25 text-accent-ink transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110 ${
                    a.featured ? 'h-16 w-16' : 'h-12 w-12'
                  }`}
                >
                  <Icon size={a.featured ? 32 : 24} aria-hidden="true" />
                </span>
                <h3 className={`relative mt-5 font-display font-semibold leading-snug ${a.featured ? 'text-2xl' : 'text-lg'}`}>
                  {a.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{a.description}</p>
                {a.points && (
                  <ul className="relative mt-4 space-y-2 text-sm text-muted">
                    {a.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-accent-ink" aria-hidden="true">
                          ▹
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {a.featured && (
                  <p className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-ink">
                    <Star size={12} aria-hidden="true" /> National level
                  </p>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
