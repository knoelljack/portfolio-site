'use client';

import { Fragment, useRef } from 'react';
import { fitWidth } from '@/lib/fit';
import { useSwell } from './useSwell';

/* The name fills the grid edge to edge: one line on a wide screen, two on a
   tall one, with each line solved to its own width on the server. The ems are
   the box width in multiples of the font-size, so they set the type size. */
const WIDE_EMS = 6.6;
const TALL_EMS = 3.3;

const VARS = {
  '--ems-w': WIDE_EMS,
  '--wd-w': fitWidth('Jack Knoell', WIDE_EMS),
  '--ems-t': TALL_EMS,
  '--wd-jack': fitWidth('Jack', TALL_EMS),
  '--wd-knoell': fitWidth('Knoell', TALL_EMS),
} as React.CSSProperties;

const WORDS = ['Jack', 'Knoell'] as const;

export function HeroName() {
  const ref = useRef<HTMLSpanElement>(null);
  useSwell(ref, '.scene-hero', 64);

  return (
    <span className="hero-name" style={VARS} ref={ref} data-reel-name aria-hidden="true">
      {WORDS.map((word, w) => (
        <Fragment key={word}>
          {w > 0 && <span className="hero-gap"> </span>}
          <span className="hero-word" data-reel-word={word.toLowerCase()}>
            {Array.from(word, (ch, i) => (
              <span key={i} className="ch">
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
