'use client';

import { useEffect, useRef } from 'react';

const STACK = [
  ['Languages', ['TypeScript', 'JavaScript', 'Java', 'Liquid']],
  ['Frameworks', ['React', 'Next.js', 'React Native', 'Node.js']],
  ['Data', ['GraphQL', 'Prisma', 'MongoDB', 'DatoCMS', 'AEM']],
  ['Platform', ['Vercel', 'AWS Lambda', 'Cloudflare Workers', 'Shopify']],
] as const;

/** Fades elements in as they enter the viewport. */
function useReveal(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scope]);
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="about" className="shell py-24 md:py-32">
      <hr className="rule" />

      <p className="mono reveal mt-8">About</p>

      <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-12">
        <div className="reveal md:col-span-7">
          <h2 className="display t-section">
            Precise engineering, <em>human interfaces.</em>
          </h2>
          <p className="lede mt-8 max-w-[52ch]">
            I believe every interface is a built structure. Every pixel serves a purpose, and every
            interaction should feel grounded in logic. My work bridges the gap between precise
            engineering and human-centric design.
          </p>
          <p className="lede mt-6 max-w-[52ch]">
            Shipped across fintech, health, energy, automotive and commerce — from enterprise
            platforms behind a login to consumer apps used daily.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Resume
            </a>
            <a href="#contact" className="ulink text-[0.9375rem]">
              Get in touch
            </a>
          </div>
        </div>

        <div className="reveal md:col-span-5 md:pt-3">
          <dl className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
            {STACK.map(([group, items]) => (
              <div key={group}>
                <dt className="mono">{group}</dt>
                <dd
                  className="mt-3 text-[0.9375rem] leading-relaxed"
                  style={{ color: 'var(--ink-2)' }}
                >
                  {items.join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
