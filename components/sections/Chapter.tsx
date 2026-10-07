'use client';

import { useEffect, useRef } from 'react';
import { fitWidth, type FitWord } from '@/lib/fit';

/* Every chapter word shares one size, so each is solved to its own width:
   "Work" runs wide, "Contact" close to normal. */
const WIDE_EMS = 5;
const TALL_EMS = 3.85;

/**
 * A section's name, set to fill the grid. Below the fold it is armed at its
 * narrowest and grows into its box as it enters; already on screen, under
 * reduced motion, or without JavaScript it is simply set at its fitted width.
 */
export function Chapter({ word }: { word: FitWord }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.setAttribute('data-armed', '');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute('data-in', '');
        io.disconnect();
      },
      { rootMargin: '0px 0px -20% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = {
    '--ems-w': WIDE_EMS,
    '--wd-w': fitWidth(word, WIDE_EMS),
    '--ems-t': TALL_EMS,
    '--wd-t': fitWidth(word, TALL_EMS),
  } as React.CSSProperties;

  return (
    <h2 className="chapter fit" ref={ref}>
      <span className="fit-word" style={style} aria-hidden="true">
        {Array.from(word, (ch, i) => (
          <span key={i} className="ch" style={{ '--i': i } as React.CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
      <span className="sr-only">{word}</span>
    </h2>
  );
}
