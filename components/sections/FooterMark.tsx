'use client';

import { useRef } from 'react';
import { fitWidth } from '@/lib/fit';
import { useSwell } from './useSwell';

/* One line edge to edge at every width; on a tall screen the line simply
   runs narrower, rather than breaking the way the hero's does. */
const MARK = {
  '--ems-w': 6.2,
  '--wd-w': fitWidth('Jack Knoell', 6.2),
  '--ems-t': 5.6,
  '--wd-t': fitWidth('Jack Knoell', 5.6),
} as React.CSSProperties;

/** The page's last line: the name again, as texture the pointer can play over. */
export function FooterMark() {
  const ref = useRef<HTMLSpanElement>(null);
  useSwell(ref, '.footer', 90);

  return (
    // Texture, not a second reading of the name — hidden from the a11y tree
    // so it is never announced twice.
    <div className="footer-mark fit" aria-hidden="true">
      <span className="fit-word" style={MARK} ref={ref}>
        {Array.from('Jack Knoell', (ch, i) => (
          <span key={i} className="ch">
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
}
