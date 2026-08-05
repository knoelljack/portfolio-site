'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: lifted ? 'rgb(233 233 229 / 0.72)' : 'transparent',
        backdropFilter: lifted ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: lifted ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${lifted ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="mono ulink" style={{ color: 'var(--ink)' }}>
          Jack Knoell
        </a>
        <div className="flex items-center gap-6 md:gap-8">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="mono ulink hover:text-[var(--ink)]">
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
