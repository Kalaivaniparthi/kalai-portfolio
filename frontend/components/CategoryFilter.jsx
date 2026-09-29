'use client';

import { motion } from 'framer-motion';

export default function CategoryFilter({ categories, active, counts, onChange }) {
  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const selected = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            aria-pressed={selected}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              selected ? 'text-on-accent' : 'glass text-muted hover:text-fg hover:shadow-glow'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-accent shadow-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">
              {cat}
              <span className={`ml-1.5 text-xs ${selected ? 'opacity-80' : 'opacity-60'}`}>{counts[cat]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
