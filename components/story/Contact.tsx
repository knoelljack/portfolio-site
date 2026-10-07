'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fitLines } from '@/lib/fit';
import { Fitted } from './Fitted';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const OPEN = fitLines(['Open to new', 'projects.'], 0, 85);

/** The detail is derivable from the href, so touch devices lose nothing. */
const ELSEWHERE = [
  { label: 'GitHub', detail: '@knoelljack', href: 'https://github.com/knoelljack' },
  { label: 'LinkedIn', detail: '/in/jackknoell', href: 'https://www.linkedin.com/in/jackknoell/' },
  { label: 'Resume', detail: 'PDF', href: '/resume.pdf' },
];

/** Twelve columns on a wide screen and four on a tall one; the stylesheet
    hides the ones a tall screen has no room for. */
const COLUMNS = 12;

/**
 * The last beat, and ordinary page from here down: the story raises the
 * cover's columns over its stage, and the form sits on plain white below.
 */
export function Contact() {
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
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="cover">
        <div className="cover-cols" aria-hidden="true">
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span key={i} className="cover-col" />
          ))}
        </div>
        <div className="shell cover-shell">
          <Fitted
            as="h2"
            id="contact-heading"
            fit={OPEN}
            label="Open to new projects."
            className="cover-word"
          />
          <p className="cover-sub">Tell me what you are building.</p>
        </div>
      </div>

      <div className="contact-rest">
        <div className="shell contact-body">
          <dl className="grid content-start gap-8">
            <div>
              <dt className="form-label">Email</dt>
              <dd className="mt-2">
                <a href="mailto:knoelljack@gmail.com" className="contact-email">
                  knoelljack@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="form-label">Based in</dt>
              <dd className="mt-2 text-[1.125rem]">Irvine, California</dd>
            </div>
          </dl>

          <div>
            {status === 'sent' ? (
              <div className="sent" role="status">
                <p className="text-[1.5rem] font-semibold">Message sent.</p>
                <p className="mt-2 text-[var(--grey)]">I&rsquo;ll get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="btn btn-quiet mt-6"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="form-row">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input id="name" name="name" required className="field" autoComplete="name" />
                </div>
                <div className="form-row">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="field"
                    autoComplete="email"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="field resize-y"
                  />
                </div>

                {/* The alert role and the explicit copy carry the error;
                    nothing leans on colour alone. */}
                {status === 'error' && (
                  <p className="text-[0.9375rem]" role="alert">
                    That didn&rsquo;t send. Try again, or email knoelljack@gmail.com directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn justify-self-start disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="shell footer">
          <ul className="footer-links">
            {ELSEWHERE.map(({ label, detail, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
                  {label}
                  <span className="detail" aria-hidden="true">
                    {detail}
                  </span>
                  <ArrowUpRight className="h-4 w-4 self-center" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="footer-end">
            <button
              type="button"
              className="replay"
              onClick={() => window.dispatchEvent(new Event('reel:replay'))}
            >
              Replay intro
            </button>
            <span>© {new Date().getFullYear()} Jack Knoell</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
