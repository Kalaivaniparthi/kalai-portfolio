/**
 * Soft pastel gradient blob that slowly morphs shape (CSS border-radius + transform keyframes,
 * GPU-friendly, no JS). Place inside a `relative isolate` parent. Static for reduced motion.
 */
export default function MorphingBlob({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute -z-10 ${className}`} style={{ opacity: 'var(--blob-opacity)' }}>
      <div
        className="animate-blob absolute inset-0 blur-3xl"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--accent) / 0.9) 0%, rgb(var(--accent-2) / 0.85) 50%, rgb(var(--accent-3) / 0.85) 100%)',
          transition: 'opacity var(--theme-duration) ease',
        }}
      />
      <div
        className="animate-blob absolute inset-[18%] blur-2xl"
        style={{
          background: 'linear-gradient(315deg, rgb(var(--accent-2) / 0.8), rgb(var(--accent-3) / 0.6))',
          animationDuration: '24s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  );
}
