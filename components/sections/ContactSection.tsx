'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
    <section id="contact" className="shell">
      <div className="indent pb-20 md:pb-28">
        <hr className="rule" />
        <p className="mono mt-7">Contact</p>

        <div className="mt-8 grid gap-12 md:mt-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2 className="t-lead duo max-w-[24ch]">
              <b>Open to new projects.</b> Tell me what you are building.
            </h2>

            <dl className="mt-8 grid gap-6">
              <div>
                <dt className="mono">Email</dt>
                <dd className="mt-1.5">
                  <a href="mailto:knoelljack@gmail.com" className="link">
                    knoelljack@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono">Based in</dt>
                <dd className="mt-1.5 text-[var(--ink-2)]">Irvine, California</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {status === 'sent' ? (
              <div className="card">
                <p className="t-row">Message sent.</p>
                <p className="body mt-2">I&rsquo;ll get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="btn btn-ghost mt-6"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label htmlFor="name" className="mono">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="field mt-1.5"
                    autoComplete="name"
                  />
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
                    className="field mt-1.5"
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
                    className="field mt-1.5 resize-y"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-[0.875rem] text-[#b42318]" role="alert">
                    That didn&rsquo;t send. Try again, or email knoelljack@gmail.com directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-solid justify-self-start disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending' : 'Send message'}
                  <ArrowRight className="nudge h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
