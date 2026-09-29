'use client';

import { memo } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { repoUrl, statusGroup } from '@/lib/data';

const MAX_TILT = 15; // degrees
const SPRING = { stiffness: 180, damping: 18, mass: 0.6 };

const statusStyles = {
  completed: { dot: 'bg-emerald-400', text: 'text-emerald-700 dark:text-emerald-300', ring: 'border-emerald-400/40 bg-emerald-400/10' },
  mvp: { dot: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-300', ring: 'border-amber-400/40 bg-amber-400/10' },
  progress: { dot: 'bg-sky-400', text: 'text-sky-700 dark:text-sky-300', ring: 'border-sky-400/40 bg-sky-400/10' },
  unfinished: { dot: 'bg-zinc-400', text: 'text-zinc-600 dark:text-zinc-300', ring: 'border-zinc-400/40 bg-zinc-400/10' },
};

export function StatusBadge({ status }) {
  const s = statusStyles[statusGroup[status] ?? 'progress'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.ring} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-ink">
      {category}
    </span>
  );
}

/** Spring-driven 3D tilt toward the cursor, plus hover scale and a moving glare highlight. */
function useTilt() {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sc = useMotionValue(1);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);
  const scale = useSpring(sc, SPRING);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(var(--accent) / 0.22), transparent 55%)`;

  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0 … 1
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * MAX_TILT);
    rx.set(-(py - 0.5) * 2 * MAX_TILT);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onPointerEnter = (e) => {
    if (!reduced && e.pointerType === 'mouse') sc.set(1.05);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
    sc.set(1);
  };

  return { style: { rotateX, rotateY, scale, transformPerspective: 900 }, glare, handlers: { onPointerMove, onPointerEnter, onPointerLeave } };
}

/**
 * `decorative` cards are the duplicated copies that make the marquee loop seamless:
 * hidden from assistive tech and removed from the tab order.
 */
function ProjectCard({ project, onOpen, decorative = false, floatDelay = 0, className = '' }) {
  const tab = decorative ? -1 : undefined;
  const stop = (e) => e.stopPropagation();
  const { style, glare, handlers } = useTilt();

  return (
    <div className={`animate-float ${className}`} style={{ animationDelay: `${floatDelay}s` }} aria-hidden={decorative || undefined}>
      <motion.article
        onClick={() => onOpen(project)}
        style={style}
        {...handlers}
        className="project-card glass group relative flex min-h-[270px] w-[290px] cursor-pointer flex-col overflow-hidden rounded-2xl p-6 will-change-transform sm:w-[340px]"
      >
        {/* Cursor-following glare */}
        <motion.div
          aria-hidden="true"
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* Top glow line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 transition-opacity group-hover:opacity-100"
        />
        {/* Corner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-accent/25 to-accent2/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-50"
        />

        <div className="relative flex items-center justify-between gap-2">
          <CategoryBadge category={project.category} />
          <StatusBadge status={project.status} />
        </div>

        <h3 className="relative mt-4 truncate font-display text-xl font-bold transition-[text-shadow] duration-300 group-hover:text-glow">
          <button
            type="button"
            tabIndex={tab}
            onClick={(e) => {
              stop(e);
              onOpen(project);
            }}
            className="max-w-full truncate text-left"
            aria-haspopup="dialog"
          >
            {project.name}
          </button>
        </h3>

        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.short}</p>

        <ul className="relative mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t} className="chip text-[11px]">
              {t}
            </li>
          ))}
        </ul>

        <div className="card-reveal relative mt-auto flex items-center gap-4 pt-4 text-sm font-medium">
          <a
            href={repoUrl(project.repo)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tab}
            onClick={stop}
            className="inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-accent-ink"
            aria-label={`${project.name} on GitHub`}
          >
            <Github size={16} aria-hidden="true" /> GitHub
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={tab}
              onClick={stop}
              className="inline-flex items-center gap-1.5 text-fg/80 transition-colors hover:text-accent-ink"
              aria-label={`${project.name} live demo`}
            >
              <ExternalLink size={16} aria-hidden="true" /> Live Demo
            </a>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-accent-ink" aria-hidden="true">
            Details <ArrowUpRight size={16} />
          </span>
        </div>
      </motion.article>
    </div>
  );
}

export default memo(ProjectCard);
