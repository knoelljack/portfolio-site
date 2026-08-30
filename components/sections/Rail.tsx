'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const LINKS = [
  ['Work', 'work'],
  ['About', 'about'],
  ['Contact', 'contact'],
] as const;

export function Rail() {
  const [active, setActive] = useState<string | null>(null);
  const [travel, setTravel] = useState(0);
  const railRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

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

  const place = useCallback(() => {
    const name = nameRef.current;
    // Only the desktop rail stacks the links under the name, so only there is
    // there anywhere for the mark to travel to; on the mobile row it stays put.
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const target = wide && active ? linkRefs.current.get(active) : null;
    // Every rail link shares one typography and one box, so the offset between
    // two of them is the whole move — the mark keeps its position within the
    // link it lands beside. offsetTop is a layout value, unperturbed by the
    // mark's own transform.
    setTravel(name && target ? target.offsetTop - name.offsetTop : 0);
  }, [active]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    // `observe` delivers a callback immediately, so the observer does the first
    // placement too — on mount, and again on every reflow and breakpoint change.
    const ro = new ResizeObserver(place);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [place]);

  return (
    <div className="rail-shell">
      <div className="shell">
        <nav className="rail" aria-label="Primary" ref={railRef}>
          <a href="#top" className="rail-link" style={{ color: 'var(--accent)' }} ref={nameRef}>
            <span
              aria-hidden="true"
              className="rail-mark"
              style={{ transform: `translateY(${travel - 1}px) rotate(14deg)` }}
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
                  ref={(el) => {
                    if (el) linkRefs.current.set(id, el);
                    else linkRefs.current.delete(id);
                  }}
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
