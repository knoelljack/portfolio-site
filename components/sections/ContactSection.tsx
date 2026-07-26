'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * The inversion beat.
 *
 * Same material, flipped: a pale luminous field with frosted white panels
 * over it, rather than a different design language. The section is opaque so
 * it fully covers the site's dark ambient layer, then lays down its own
 * light-tinted orbs for the glass here to refract.
 */
function LightField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgb(var(--aura-indigo) / 0.22) 0%, transparent 66%)',
          animation: 'aura-drift-a 38s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[30%] right-[-8%] w-[46vw] h-[46vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgb(var(--aura-violet) / 0.2) 0%, transparent 66%)',
          animation: 'aura-drift-b 45s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[25%] w-[42vw] h-[42vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgb(var(--aura-teal) / 0.14) 0%, transparent 68%)',
          animation: 'aura-drift-c 52s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export function ContactSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 py-28 md:py-36 text-center"
      style={{ background: 'var(--light-bg)', color: 'var(--light-text)' }}
    >
      <LightField />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          className="inline-flex items-center gap-2.5 px-4 py-2 mb-10 rounded-full btn-glass-light"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-display text-[12px] font-semibold tracking-tight">
            Available for new projects
          </span>
        </motion.div>

        <motion.h2
          className="font-display font-extrabold tracking-tight leading-[0.92] mb-14"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
        >
          Let&apos;s build
          <br />
          something
          <br />
          together.
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
        >
          <button
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setIsSubmitted(false);
            }}
            className="btn btn-solid-dark px-10 py-4"
          >
            {isFormOpen ? 'Close' : 'Start a Project'}
          </button>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glass-light px-10 py-4"
          >
            View Resume
          </a>
        </motion.div>

        {isFormOpen && (
          <motion.div
            className="mt-14 max-w-xl mx-auto text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="glass-light p-7 md:p-9">
              {isSubmitted ? (
                <div className="flex flex-col items-center gap-4 text-center py-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(16,185,129,0.14)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                    }}
                  >
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl tracking-tight">
                    Message Sent
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--light-text-muted)' }}>
                    I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setIsFormOpen(false);
                    }}
                    className="btn btn-glass-light px-8 py-3 mt-2"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      className="block font-display text-[12px] font-semibold tracking-tight mb-2"
                      style={{ color: 'var(--light-text-muted)' }}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="input-glass-light px-4 py-3.5 text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      className="block font-display text-[12px] font-semibold tracking-tight mb-2"
                      style={{ color: 'var(--light-text-muted)' }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input-glass-light px-4 py-3.5 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      className="block font-display text-[12px] font-semibold tracking-tight mb-2"
                      style={{ color: 'var(--light-text-muted)' }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="input-glass-light px-4 py-3.5 text-sm resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {isError && (
                    <p className="text-sm text-red-600">
                      There was an error sending your message. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-solid-dark w-full py-4 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
