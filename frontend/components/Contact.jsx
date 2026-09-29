'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';
import SectionHeading from './SectionHeading';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';
import SectionBackdrop from './SectionBackdrop';
import { useInView, useWebGLSupport } from '@/lib/hooks';

function CoreFallback() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden="true">
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 rounded-full border border-accent/40 animate-ping-soft" />
        <div
          className="absolute inset-6 rounded-full animate-glow-pulse"
          style={{ background: 'radial-gradient(circle at 35% 35%, rgb(var(--accent) / 0.9), rgb(var(--accent-2) / 0.5) 60%, transparent 75%)' }}
        />
      </div>
    </div>
  );
}

const AICoreScene = dynamic(() => import('./three/AICoreScene'), { ssr: false, loading: () => <CoreFallback /> });

export default function Contact() {
  const coreRef = useRef(null);
  const inView = useInView(coreRef);
  const webgl = useWebGLSupport();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate py-24 sm:py-32">
      <SectionBackdrop variant="left" />
      <div className="container">
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title="Let's build something intelligent"
          subtitle="Internships, collaborations, or just a chat about RAG and agents. My inbox is open."
        />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            ref={coreRef}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="relative h-[280px] sm:h-[380px] lg:h-[460px]"
          >
            {webgl ? (
              <ErrorBoundary fallback={<CoreFallback />}>
                <AICoreScene active={inView} />
              </ErrorBoundary>
            ) : (
              <CoreFallback />
            )}
            <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-ink/70">
              AI core · listening
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="mb-8 text-center font-display text-2xl font-semibold">Connect with me</h3>
          <SocialLinks variant="cards" className="mx-auto max-w-4xl" />
        </motion.div>
      </div>
    </section>
  );
}
