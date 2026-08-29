'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  ['Work', 'work'],
  ['About', 'about'],
  ['Contact', 'contact'],
] as const;

export function Rail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = LINKS.map(([, id]) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Sections are observed in document order, so the last visible one is
        // the one the reader has scrolled furthest into.
        const ids = sections.map((s) => s.id).filter((id) => visible.has(id));
        setActive(ids.at(-1) ?? null);
      },
      // A band across the middle of the viewport: a section counts as read
      // only once it owns the centre of the screen, not the moment its first
      // pixel appears.
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="rail-shell">
      <div className="shell">
        <nav className="rail" aria-label="Primary">
          <a href="#top" className="rail-link" style={{ color: 'var(--accent)' }}>
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-[7px] w-[7px] translate-y-[-1px] rotate-[14deg] bg-[var(--accent)] align-middle"
            />
            Jack Knoell
          </a>
          <ul className="rail-links">
            {LINKS.map(([label, id]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="rail-link"
                  aria-current={active === id ? 'location' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
