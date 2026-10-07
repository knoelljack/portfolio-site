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
    <section id="contact" className="contact shell" aria-labelledby="contact-heading">
      <header className="contact-head">
        <h2 id="contact-heading" className="t-label">
          Contact
        </h2>
        <p className="t-lead">Open to new projects.</p>
        <p className="t-body">Tell me what you are building.</p>
      </header>

      <div className="contact-grid">
        <dl className="grid content-start gap-8">
          <div>
            <dt className="t-label">Email</dt>
            <dd className="mt-2">
              <a href="mailto:knoelljack@gmail.com" className="contact-email">
                knoelljack@gmail.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="t-label">Based in</dt>
            <dd className="mt-2 text-[1.0625rem]">Irvine, California</dd>
          </div>
        </dl>

        <div>
          {status === 'sent' ? (
            <div className="card" role="status">
              <p className="t-lead">Message sent.</p>
              <p className="t-body mt-2">I&rsquo;ll get back to you shortly.</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="btn btn-ghost mt-6"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="form-row">
                <label htmlFor="name" className="t-label field-label">
                  Name
                </label>
                <input id="name" name="name" required className="field mt-2" autoComplete="name" />
              </div>
              <div className="form-row">
                <label htmlFor="email" className="t-label field-label">
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
              <div className="form-row">
                <label htmlFor="message" className="t-label field-label">
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

              {/* No colour can signal an error on a page that is all one
                  colour, so the alert role and the explicit copy carry it. */}
              {status === 'error' && (
                <p className="text-[0.9375rem] text-white" role="alert">
                  That didn&rsquo;t send. Try again, or email knoelljack@gmail.com directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-solid justify-self-start disabled:opacity-60"
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
