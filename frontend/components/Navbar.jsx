'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { navLinks, site } from '@/lib/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className={`mx-3 mt-3 flex items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 sm:mx-auto sm:max-w-6xl sm:px-5 ${
          scrolled ? 'glass' : 'border border-transparent'
        }`}
      >
        <a
          href="#top"
          className="group flex items-center gap-2 font-display text-lg font-bold"
          aria-label={`${site.name}, back to top`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/50 text-sm text-accent-ink transition-shadow group-hover:shadow-glow">
            KP
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'location' : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active === id ? 'bg-accent/15 text-accent-ink' : 'text-muted hover:text-fg'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.resume}
            download
            aria-label="Download resume"
            title="Download resume"
            className="glass grid h-11 w-11 place-items-center rounded-full text-fg hover:scale-110 hover:shadow-glow"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
