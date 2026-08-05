'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="shell py-24 md:py-32">
      <hr className="rule" />

      <p className="mono mt-8">Contact</p>

      <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <h2 className="display t-section">
            Let&rsquo;s build <em>something together.</em>
          </h2>

          <dl className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="mono">Email</dt>
              <dd className="mt-2 text-[0.9375rem]">
                <a href="mailto:knoelljack@gmail.com" className="ulink">
                  knoelljack@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="mono">Availability</dt>
              <dd className="mt-2 text-[0.9375rem]" style={{ color: 'var(--ink-2)' }}>
                Open to new projects
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-6 md:col-start-8">
          {status === 'sent' ? (
            <div className="border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <p className="display" style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)' }}>
                Message sent.
              </p>
              <p className="lede mt-3">I&rsquo;ll get back to you shortly.</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="btn btn-ghost mt-8"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <label htmlFor="name" className="mono">
                  Name
                </label>
                <input id="name" name="name" required className="field mt-2" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="email" className="mono">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="field mt-2"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="message" className="mono">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="field mt-2 resize-y"
                />
              </div>

              {status === 'error' && (
                <p className="text-[0.875rem]" style={{ color: '#B42318' }} role="alert">
                  That didn&rsquo;t send. Try again, or email knoelljack@gmail.com directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-solid justify-self-start disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
