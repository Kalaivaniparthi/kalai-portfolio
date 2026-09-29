'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Github, ExternalLink, Target, ListChecks, Layers, Lightbulb } from 'lucide-react';
import { CategoryBadge, StatusBadge } from './ProjectCard';
import { getLenis } from './SmoothScroll';
import { repoUrl } from '@/lib/data';

function Block({ icon: Icon, title, children }) {
  return (
    <section className="mt-8">
      <h3 className="mb-3 inline-flex items-center gap-2 font-display text-lg font-semibold">
        <Icon size={18} className="text-accent-ink" aria-hidden="true" /> {title}
      </h3>
      {children}
    </section>
  );
}

export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop(); // freeze smooth-scrolled page behind the dialog
    document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      // Simple focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      getLenis()?.start();
      document.body.style.paddingRight = '';
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3d3d5c]/25 p-0 backdrop-blur-md dark:bg-black/60 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            data-lenis-prevent
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative h-full w-full overflow-y-auto border border-line bg-bg p-6 shadow-glow-lg sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-3xl sm:p-10"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="glass absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full hover:rotate-90 hover:shadow-glow"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 pr-12">
                <CategoryBadge category={project.category} />
                <StatusBadge status={project.status} />
              </div>
              <h2 id="project-modal-title" className="mt-4 font-display text-3xl font-bold text-glow sm:text-4xl">
                {project.name}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg/90">{project.description}</p>

              <Block icon={Target} title="Problem it solves">
                <p className="leading-relaxed text-muted">{project.problem}</p>
              </Block>

              <Block icon={ListChecks} title="Key features">
                <ul className="space-y-2 text-muted">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-accent-ink" aria-hidden="true">▹</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block icon={Layers} title="Tech stack">
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li key={t} className="chip px-3 py-1.5 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block icon={Lightbulb} title="What I learned">
                <p className="glass rounded-xl p-4 leading-relaxed text-muted">{project.learned}</p>
              </Block>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href={repoUrl(project.repo)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Github size={18} aria-hidden="true" /> View on GitHub
                </a>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <ExternalLink size={18} aria-hidden="true" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
