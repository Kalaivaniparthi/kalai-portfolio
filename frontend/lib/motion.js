// Shared Framer Motion presets for consistent section reveals.
// Usage: <motion.ul variants={revealContainer} {...revealInView}> <motion.li variants={revealItem} /> </motion.ul>

export const EASE = [0.2, 0.8, 0.2, 1];

export const revealContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export const revealItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const revealInView = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
};
