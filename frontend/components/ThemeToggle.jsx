'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Until mounted, assume the default (dark) so server and client markup match
  const isDark = !mounted || resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    const apply = () => {
      // Apply the class synchronously so the View Transition captures the new state
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 700ms whole-page crossfade where supported; CSS colour transitions everywhere else
    if (document.startViewTransition && !reduced) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`glass relative grid h-11 w-11 place-items-center rounded-full text-fg hover:scale-110 hover:shadow-glow ${className}`}
    >
      <span className="relative h-5 w-5">
        <Sun
          aria-hidden="true"
          className={`absolute inset-0 h-5 w-5 transition-all duration-700 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          aria-hidden="true"
          className={`absolute inset-0 h-5 w-5 transition-all duration-700 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </span>
    </button>
  );
}
