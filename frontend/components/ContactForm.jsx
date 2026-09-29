'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Magnetic from './Magnetic';
import { API_URL, site } from '@/lib/data';

const initial = { name: '', email: '', message: '', website: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = typeof data.detail === 'string' ? data.detail : null;
        throw new Error(detail || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      setForm(initial);
    } catch (err) {
      setStatus('error');
      setError(
        err.name === 'AbortError'
          ? 'The request timed out. Please try again.'
          : err.message === 'Failed to fetch'
            ? 'Could not reach the server. Please try again later.'
            : err.message
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  const sending = status === 'sending';
  const inputClass =
    'w-full rounded-xl border border-line bg-card px-4 py-3 text-fg placeholder:text-muted/60 outline-none transition-all duration-300 focus:border-accent focus:shadow-glow';

  return (
    <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8" aria-describedby="contact-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            value={form.name}
            onChange={update}
            placeholder="Your name"
            className={inputClass}
            disabled={sending}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={form.email}
            onChange={update}
            placeholder="you@example.com"
            className={inputClass}
            disabled={sending}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          value={form.message}
          onChange={update}
          placeholder="Tell me about your project, role or idea..."
          className={`${inputClass} resize-y`}
          disabled={sending}
        />
      </div>

      {/* Honeypot: hidden from humans, bots tend to fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
      </div>

      <Magnetic className="mt-6 w-full sm:w-auto">
      <button type="submit" disabled={sending} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
        {sending ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending...
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" /> Send Message
          </>
        )}
      </button>
      </Magnetic>

      <div id="contact-status" aria-live="polite" className="min-h-[1.5rem]">
        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 size={18} aria-hidden="true" /> Message sent! I&apos;ll get back to you soon.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              key="err"
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {error} You can also email me directly at{' '}
                <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                  {site.email}
                </a>
                .
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
