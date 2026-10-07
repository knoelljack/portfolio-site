'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const LINKS = [
  ['Work', 'work'],
  ['About', 'about'],
  ['Contact', 'contact'],
] as const;

export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [travel, setTravel] = useState(0);
  const barRef = useRef<HTMLElement>(null);
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

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const place = useCallback(() => {
    const name = nameRef.current;
    const target = active ? linkRefs.current.get(active) : null;
    // Every link shares one box model, so the offset between two of them is
    // the whole move. offsetLeft is a layout value, unperturbed by the
    // pixel's own transform.
    setTravel(name && target ? target.offsetLeft - name.offsetLeft : 0);
  }, [active]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // `observe` delivers a callback immediately, so the observer does the first
    // placement too — on mount, and again on every reflow and breakpoint change.
    const ro = new ResizeObserver(place);
    ro.observe(bar);
    return () => ro.disconnect();
  }, [place]);

  return (
    <div className="nav-shell" data-scrolled={scrolled || undefined} data-reel-in>
      <nav className="nav shell" aria-label="Primary" ref={barRef}>
        <span
          aria-hidden="true"
          className="nav-pixel"
          style={{ transform: `translateX(${travel}px)` }}
        />
        <a href="#top" className="nav-link nav-name" ref={nameRef}>
          Jack Knoell
        </a>
        <ul className="nav-links">
          {LINKS.map(([label, id]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="nav-link"
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
  );
}
