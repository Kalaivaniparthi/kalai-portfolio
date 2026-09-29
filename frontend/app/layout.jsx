import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import ThemeProvider from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import ParticlesBackground from '@/components/ParticlesBackground';
import CursorTrail from '@/components/CursorTrail';
import ClickRipple from '@/components/ClickRipple';
import ScrollProgress from '@/components/ScrollProgress';
import { site } from '@/lib/data';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const description = `${site.name} — ${site.title} in ${site.location}. ${site.tagline}`;

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    'Kalaivani',
    'Generative AI Engineer',
    'RAG',
    'AI Agents',
    'LangChain',
    'FastAPI',
    'Python',
    'Backend Engineer',
    'Chennai',
    'Portfolio',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: `${site.name} | ${site.title}`,
    description,
    siteName: `${site.name} Portfolio`,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.title}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#faf5ff' },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.title,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' },
  alumniOf: 'Agni College of Technology',
  sameAs: [site.linkedin, site.github],
  knowsAbout: ['Generative AI', 'RAG', 'AI Agents', 'LangChain', 'FastAPI', 'Python'],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <ParticlesBackground />
          {children}
          <ScrollProgress />
          <CursorTrail />
          <ClickRipple />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
