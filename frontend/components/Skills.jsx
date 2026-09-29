'use client';

import { motion } from 'framer-motion';
import { Code, Brain, Server, Container, Database, Languages } from 'lucide-react';
import SectionHeading from './SectionHeading';
import SectionBackdrop from './SectionBackdrop';
import { skillGroups } from '@/lib/data';
import { revealContainer, revealInView, revealItem } from '@/lib/motion';

const icons = { code: Code, brain: Brain, server: Server, container: Container, database: Database, languages: Languages };

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative isolate py-24 sm:py-32">
      <SectionBackdrop variant="right" />
      <div className="container">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title="Tech stack & toolkit"
          subtitle="The tools I use to design, build and ship AI-powered systems."
        />

        <motion.ul variants={revealContainer} {...revealInView} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = icons[group.icon] ?? Code;
            return (
              <motion.li
                key={group.id}
                variants={revealItem}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="glass glow-hover group rounded-2xl p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 text-accent-ink transition-shadow duration-300 group-hover:shadow-glow">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="chip hover:border-accent hover:text-accent-ink">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
