'use client';

import { motion } from 'framer-motion';
import { Award, BadgeCheck, GraduationCap, Languages } from 'lucide-react';
import SectionHeading from './SectionHeading';
import SectionBackdrop from './SectionBackdrop';
import { certifications } from '@/lib/data';
import { revealContainer, revealInView, revealItem } from '@/lib/motion';

const icons = { award: Award, badge: BadgeCheck, graduation: GraduationCap, languages: Languages };

const statusTone = (status) => {
  if (status === 'Completed') return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300';
  if (status.startsWith('Target')) return 'border-accent2/50 bg-accent2/15 text-pink-600 dark:text-accent2';
  if (status === 'In Progress') return 'border-sky-400/40 bg-sky-400/10 text-sky-700 dark:text-sky-300';
  return 'border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300';
};

export default function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative isolate py-24 sm:py-32">
      <SectionBackdrop variant="center" />
      <div className="container">
        <SectionHeading id="certifications-title" eyebrow="Certifications" title="Credentials & learning" />

        <motion.ul variants={revealContainer} {...revealInView} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => {
            const Icon = icons[cert.icon] ?? Award;
            return (
              <motion.li
                key={cert.name}
                variants={revealItem}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="glass glow-hover group flex flex-col rounded-2xl p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent3/20 text-accent-ink transition-shadow duration-300 group-hover:shadow-glow">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold leading-snug">{cert.name}</h3>
                <p className="mt-2 text-sm text-muted">{cert.issuer}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                  <span className="font-mono text-sm text-muted">{cert.year}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(cert.status)}`}>
                    {cert.status}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
