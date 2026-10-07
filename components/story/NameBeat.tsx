'use client';

import { Fragment, useRef } from 'react';
import { fitWidth } from '@/lib/fit';
import { useSwell } from './useSwell';

/* The name fills the grid edge to edge: one line on a wide screen, two on a
   tall one, each line solved to its own width on the server. The ems are the
   box width in multiples of the font-size, so they set the type size. */
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

/**
 * The first beat, and the reel's last frame: the reel lands its particles on
 * these letters. They stay plain inline text — the reel reads their baselines
 * — so the story moves each word, not each letter.
 */
export function NameBeat() {
  const ref = useRef<HTMLSpanElement>(null);
  useSwell(ref, '.beat-name', 64);

  return (
    <header id="top" className="beat beat-name" data-beat="name">
      <div className="shell name-shell">
        <p className="name-role" data-reel-in>
          Front-end engineer
        </p>
        <h1 className="name-title">
          <span className="name" style={VARS} ref={ref} data-reel-name aria-hidden="true">
            {WORDS.map((word, w) => (
              <Fragment key={word}>
                {w > 0 && <span className="name-gap"> </span>}
                <span className="name-mask">
                  <span className="name-word" data-reel-word={word.toLowerCase()}>
                    {Array.from(word, (ch, i) => (
                      <span key={i} className="ch">
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              </Fragment>
            ))}
          </span>
          <span className="sr-only">Jack Knoell</span>{' '}
          <span className="lede" data-reel-in>
            builds interfaces. And the systems behind them.
            <span className="pixel" aria-hidden="true" />
          </span>
        </h1>
      </div>
      <p className="name-cue" aria-hidden="true" data-reel-in>
        Scroll
      </p>
    </header>
  );
}
