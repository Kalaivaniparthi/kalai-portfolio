import { ImageResponse } from 'next/og';
import { site } from '@/lib/data';

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'radial-gradient(circle at 75% 30%, #003b44 0%, #0a0a0f 55%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#00ffff', letterSpacing: 6 }}>PORTFOLIO</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 16, textShadow: '0 0 40px rgba(0,255,255,0.6)' }}>
          {site.name}
        </div>
        <div style={{ fontSize: 44, color: '#a0a0b0', marginTop: 8 }}>{site.title}</div>
        <div style={{ fontSize: 28, color: '#d0d0dc', marginTop: 36, maxWidth: 900 }}>{site.tagline}</div>
      </div>
    ),
    size
  );
}
