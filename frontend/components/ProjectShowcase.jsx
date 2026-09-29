'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, GalleryHorizontal } from 'lucide-react';
import SectionHeading from './SectionHeading';
import CategoryFilter from './CategoryFilter';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionBackdrop from './SectionBackdrop';
import { categories, projects } from '@/lib/data';

const MIN_STREAM_ITEMS = 8; // enough cards to fill wide screens before the loop repeats
const SECONDS_PER_CARD = 5;

function Stream({ items, onOpen }) {
  // Repeat short lists so one "half" of the track is wider than the viewport,
  // then render that half twice so translateX(-50%) loops seamlessly.
  const half = useMemo(() => {
    const out = [];
    while (out.length < Math.max(MIN_STREAM_ITEMS, items.length)) out.push(...items);
    return out;
  }, [items]);

  return (
    <div className="marquee py-10" style={{ '--duration': `${half.length * SECONDS_PER_CARD}s` }}>
      <ul className="marquee-track">
        {[...half, ...half].map((p, i) => {
          const decorative = i >= items.length; // only the first copy is exposed to screen readers / keyboard
          return (
            <motion.li
              key={`${p.slug}-${i}`}
              className="shrink-0 pr-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              aria-hidden={decorative || undefined}
            >
              <ProjectCard project={p} onOpen={onOpen} decorative={decorative} floatDelay={-(i % 5) * 1.2} />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function Grid({ items, onOpen }) {
  return (
    <ul className="container grid justify-items-center gap-8 py-10 md:grid-cols-2 xl:grid-cols-3">
      {items.map((p, i) => (
        <motion.li
          key={p.slug}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: Math.min(i, 9) * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ProjectCard project={p} onOpen={onOpen} floatDelay={-(i % 5) * 1.2} />
        </motion.li>
      ))}
    </ul>
  );
}

export default function ProjectShowcase() {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('stream');
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const c = { All: projects.length };
    categories.slice(1).forEach((cat) => (c[cat] = projects.filter((p) => p.category === cat).length));
    return c;
  }, []);

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const open = useCallback((p) => setSelected(p), []);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <SectionBackdrop variant="center" />

      <div className="container relative">
        <SectionHeading
          id="projects-title"
          eyebrow="Neural project stream"
          title="Things I've built"
          subtitle="RAG systems, AI agents, APIs and experiments. Hover to pause the stream, click a card for the full story."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <CategoryFilter categories={categories} active={filter} counts={counts} onChange={setFilter} />

          <div role="group" aria-label="Project layout" className="glass inline-flex rounded-full p-1">
            {[
              { id: 'stream', label: 'Stream', Icon: GalleryHorizontal },
              { id: 'grid', label: 'Grid', Icon: LayoutGrid },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === id ? 'bg-accent/20 text-accent-ink' : 'text-muted hover:text-fg'
                }`}
              >
                <Icon size={14} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="sr-only" aria-live="polite">
          Showing {filtered.length} {filter === 'All' ? '' : filter} projects
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${view}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'stream' ? <Stream items={filtered} onOpen={open} /> : <Grid items={filtered} onOpen={open} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal project={selected} onClose={close} />
    </section>
  );
}
