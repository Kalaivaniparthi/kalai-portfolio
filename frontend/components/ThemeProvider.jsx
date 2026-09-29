'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';

// next-themes injects a blocking script that sets the theme class before paint,
// so there is no flash of the wrong theme on reload. Choice persists in localStorage.
// MotionConfig reducedMotion="user" makes every Framer animation respect prefers-reduced-motion.
export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kp-theme">
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
