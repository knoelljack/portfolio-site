'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

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
    <section className="bg-white px-8 py-32 text-center text-black relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.span
          className="font-display text-[10px] uppercase tracking-[0.5em] mb-8 block"
          style={{ opacity: 0.4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Available for new projects
        </motion.span>

        <motion.h2
          className="font-display font-extrabold tracking-tighter uppercase leading-[0.85] mb-20"
          style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Let's Build
          <br />
          Something
          <br />
          Together.
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setIsSubmitted(false);
            }}
            className="btn-primary-dark px-14 py-6"
          >
            {isFormOpen ? 'Close' : 'Start a Project'}
          </button>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-dark-on-white px-14 py-6"
          >
            View Resume
          </a>
        </motion.div>

        {isFormOpen && (
          <motion.div
            className="mt-20 max-w-xl mx-auto text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tighter">
                  Message Sent
                </h3>
                <p className="text-sm" style={{ opacity: 0.6 }}>
                  I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsFormOpen(false);
                  }}
                  className="btn-outline-dark-on-white px-8 py-3 text-[10px] mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-on-white w-full px-4 py-3 text-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-on-white w-full px-4 py-3 text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block font-display text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="input-on-white w-full px-4 py-3 text-sm resize-none"
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
                  className="btn-primary-dark w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
