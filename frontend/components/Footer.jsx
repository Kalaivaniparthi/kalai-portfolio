import SocialLinks from './SocialLinks';
import { navLinks, site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-line">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold text-glow">{site.name}</p>
          <p className="mt-1 text-accent-ink">{site.title}</p>
          <p className="mt-4 max-w-xs text-sm text-muted">Building the future of AI, one pipeline at a time.</p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">Quick Links</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted transition-colors hover:text-accent-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">Connect</p>
          <SocialLinks variant="list" className="text-sm" />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container py-6 text-center text-xs text-muted">
          © 2026 {site.name}. Built with Next.js, Three.js, and FastAPI.
        </p>
      </div>
    </footer>
  );
}
