'use client';

import { Suspense, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, MapPin } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import SocialLinks from './SocialLinks';
import Magnetic from './Magnetic';
import { site } from '@/lib/data';
import { EASE } from '@/lib/motion';
import { useInView, usePrefersReducedMotion, useWebGLSupport } from '@/lib/hooks';

function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border border-accent/60 animate-ping-soft" />
          <span className="absolute inset-3 rounded-full bg-accent/30 animate-pulse" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-ink/80 animate-pulse">
          Loading neural network...
        </p>
      </div>
    </div>
  );
}

// Static fallback for devices without WebGL (or if the canvas crashes)
function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.22), transparent 45%), radial-gradient(circle at 75% 65%, rgb(var(--accent-2) / 0.2), transparent 50%), radial-gradient(circle at 60% 20%, rgb(var(--accent-3) / 0.15), transparent 45%)',
      }}
    >
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <span className="select-none whitespace-nowrap font-display text-[18vw] font-bold leading-none text-accent/[0.08]">
          {site.name}
        </span>
      </div>
    </div>
  );
}

const NeuralNetworkScene = dynamic(() => import('./three/NeuralNetworkScene'), {
  ssr: false,
  loading: () => null, // the single skeleton below stays up until the canvas reports ready
});

/** Name letters drop in one by one, then each keeps a soft, staggered glow pulse. */
function AnimatedName({ text }) {
  const letters = Array.from(text);
  return (
    <motion.h1
      aria-label={text}
      className="font-display text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block animate-letter-glow"
          style={{ animationDelay: `${1.2 + i * 0.12}s`, whiteSpace: 'pre' }}
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -80, filter: 'blur(10px)' },
            show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.h1>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function NeuralNetworkHero() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Parallax: background layers drift down slower than the page scrolls, content lifts and fades
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const showStatic = webgl === false || failed;

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Background layers (parallax) */}
      <motion.div
        aria-hidden="true"
        style={{ y: gridY }}
        className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {showStatic ? (
          <StaticBackdrop />
        ) : webgl ? (
          <ErrorBoundary fallback={<StaticBackdrop />} onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <div className={`h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
                <NeuralNetworkScene active={inView} animate={!reduced} onReady={() => setReady(true)} />
              </div>
            </Suspense>
            {!ready && <LoadingSkeleton />}
          </ErrorBoundary>
        ) : (
          <LoadingSkeleton />
        )}
      </motion.div>

      {/* Readability: soft edge vignette + backdrop behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgb(var(--bg)/0.85)_90%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg/80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(var(--bg)/0.7)_0%,rgb(var(--bg)/0.35)_45%,transparent_70%)]"
      />

      {/* Overlay content */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container relative z-10 py-28">
        <div className="flex flex-col items-center text-center [perspective:800px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping-soft" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Neural interface online
          </motion.p>

          <AnimatedName text={site.name} />

          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
            <motion.p variants={item} className="mt-4 font-display text-xl font-medium sm:text-2xl md:text-3xl">
              <span className="text-gradient">{site.title}</span>
            </motion.p>

            <motion.p variants={item} className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
              {site.tagline}
            </motion.p>

            <motion.p variants={item} className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} aria-hidden="true" /> {site.location}
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Magnetic>
                <a href="#projects" className="btn-primary">
                  View Projects <ArrowDown size={18} aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={site.resume} download className="btn-ghost">
                  <Download size={18} aria-hidden="true" /> Download Resume
                </a>
              </Magnetic>
            </motion.div>

            <motion.div variants={item} className="mt-8">
              <SocialLinks variant="icons" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-muted transition-colors hover:text-accent-ink sm:block"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-current pt-2">
          <span className="h-2 w-1 rounded-full bg-current animate-float" />
        </span>
      </a>
    </section>
  );
}
