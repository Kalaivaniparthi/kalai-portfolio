import { Linkedin, Github, Mail } from 'lucide-react';
import Magnetic from './Magnetic';
import { site } from '@/lib/data';

export const socials = [
  { id: 'linkedin', label: 'LinkedIn', action: 'Connect', href: site.linkedin, Icon: Linkedin, external: true },
  { id: 'github', label: 'GitHub', action: 'View Code', href: site.github, Icon: Github, external: true },
  { id: 'email', label: 'Email', action: 'Say Hello', href: `mailto:${site.email}`, Icon: Mail, external: false },
];

// mailto: links open the mail client directly; a new tab would just be left blank
const linkProps = (s) => (s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {});

/**
 * variant="icons" — compact glowing icon row (hero)
 * variant="cards" — large glassmorphism cards (contact)
 * variant="list"  — icon + text list (footer)
 */
export default function SocialLinks({ variant = 'icons', className = '' }) {
  if (variant === 'cards') {
    return (
      <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`}>
        {socials.map((s) => (
          <li key={s.id}>
            <Magnetic className="block h-full">
            <a
              href={s.href}
              {...linkProps(s)}
              aria-label={`${s.label}: ${s.action}`}
              className="glass group flex h-full flex-col items-center gap-2 rounded-2xl px-6 py-7 text-center hover:scale-105 hover:border-accent/60 hover:shadow-glow-lg"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent-ink shadow-glow transition-shadow duration-300 group-hover:shadow-glow-lg">
                <s.Icon size={32} aria-hidden="true" />
              </span>
              <span className="mt-2 font-display text-lg font-semibold">{s.label}</span>
              <span className="text-sm text-muted transition-colors group-hover:text-accent-ink">{s.action}</span>
            </a>
            </Magnetic>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'list') {
    return (
      <ul className={`space-y-3 ${className}`}>
        {socials.map((s) => (
          <li key={s.id}>
            <a
              href={s.href}
              {...linkProps(s)}
              className="group inline-flex items-center gap-3 break-all text-muted transition-colors hover:text-accent-ink"
            >
              <s.Icon size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:scale-110" />
              <span>{s.id === 'email' ? site.email : s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {socials.map((s) => (
        <li key={s.id}>
          <Magnetic>
          <a
            href={s.href}
            {...linkProps(s)}
            aria-label={s.label}
            title={s.label}
            className="glass grid h-12 w-12 place-items-center rounded-full text-fg hover:-translate-y-1 hover:border-accent/70 hover:text-accent-ink hover:shadow-glow-lg"
          >
            <s.Icon size={24} aria-hidden="true" />
          </a>
          </Magnetic>
        </li>
      ))}
    </ul>
  );
}
