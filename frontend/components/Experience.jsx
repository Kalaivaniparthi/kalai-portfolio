'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';
import SectionBackdrop from './SectionBackdrop';
import { experience } from '@/lib/data';
import { revealContainer, revealInView, revealItem } from '@/lib/motion';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative isolate py-24 sm:py-32">
      <SectionBackdrop variant="left" />
      <div className="container max-w-4xl">
        <SectionHeading id="experience-title" eyebrow="Experience" title="Where I've been building" />

        <motion.ol variants={revealContainer} {...revealInView} className="relative">
          {/* Glowing connector line */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-4 top-0 w-[2px] bg-gradient-to-b from-accent via-accent2 to-transparent shadow-glow sm:left-1/2 sm:-translate-x-1/2"
          />

          {experience.map((job, i) => {
            const right = i % 2 === 1;
            return (
              <motion.li
                key={job.company}
                variants={revealItem}
                className="relative mb-12 pl-12 last:mb-0 sm:grid sm:grid-cols-2 sm:gap-12 sm:pl-0"
              >
                {/* Node */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-6 z-10 grid h-5 w-5 -translate-x-1/2 place-items-center sm:left-1/2"
                >
                  {job.current && <span className="absolute h-full w-full rounded-full bg-accent animate-ping-soft" />}
                  <span className="relative h-4 w-4 rounded-full border-2 border-accent bg-bg shadow-glow" />
                </span>

                <motion.article
                  variants={revealContainer}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className={`glass glow-hover rounded-2xl p-6 ${right ? 'sm:col-start-2' : 'sm:col-start-1 sm:text-right'}`}
                >
                  <motion.div
                    variants={revealItem}
                    className={`flex flex-wrap items-center gap-2 text-sm text-muted ${right ? '' : 'sm:justify-end'}`}
                  >
                    <Calendar size={14} aria-hidden="true" />
                    <span className="font-mono">{job.period}</span>
                    {job.current && (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent-ink">Current</span>
                    )}
                  </motion.div>
                  <motion.h3 variants={revealItem} className="mt-2 font-display text-xl font-bold">
                    {job.role}
                  </motion.h3>
                  <motion.p
                    variants={revealItem}
                    className={`mt-1 inline-flex items-center gap-2 font-medium text-accent-ink ${right ? '' : 'sm:flex-row-reverse'}`}
                  >
                    <Briefcase size={16} aria-hidden="true" /> {job.company}
                  </motion.p>
                  <ul className={`mt-4 space-y-2 text-left text-muted ${right ? '' : 'sm:text-right'}`}>
                    {job.points.map((p) => (
                      <motion.li key={p} variants={revealItem} className="leading-relaxed">
                        <span className="text-accent-ink" aria-hidden="true">
                          ▹{' '}
                        </span>
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.ul
                    variants={revealItem}
                    className={`mt-4 flex flex-wrap gap-2 ${right ? '' : 'sm:justify-end'}`}
                    aria-label="Technologies"
                  >
                    {job.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </motion.ul>
                </motion.article>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
