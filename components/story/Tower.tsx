'use client';

import { useState } from 'react';

/** The stack by group, top of the tower first; the foundation is last. */
const STACK = [
  ['Languages', ['TypeScript', 'JavaScript', 'SQL', 'Liquid'], 'orange'],
  ['Frameworks', ['React', 'Next.js', 'React Native', 'Node.js'], 'teal'],
  ['Styling', ['Tailwind', 'Sass', 'CSS', 'Figma'], 'pink'],
  ['Data', ['GraphQL', 'Contentful', 'DatoCMS', 'AEM', 'MongoDB'], 'orange'],
  ['Testing', ['Vitest', 'Storybook', 'GitHub Actions'], 'teal'],
  ['Platform', ['Vercel', 'Cloudflare Workers', 'Shopify'], 'pink'],
] as const;

/**
 * Six blocks stacked into a tower. A pointer pulls a block out on hover; a
 * finger has no hover, so a tap pulls it out instead, and a second tap (or a
 * tap on another block) puts it back.
 */
export function Tower() {
  const [pulled, setPulled] = useState<number | null>(null);

  return (
    <ul className="tower" aria-label="Stack">
      {STACK.map(([group, names, color], i) => (
        <li
          key={group}
          className="bar"
          data-pulled={pulled === i || undefined}
          style={{ '--c': `var(--${color})` } as React.CSSProperties}
          onPointerUp={(e) => {
            if (e.pointerType !== 'mouse') setPulled((p) => (p === i ? null : i));
          }}
        >
          <span className="bar-label">{group}</span>{' '}
          <span className="bar-names">{names.join(', ')}</span>
        </li>
      ))}
    </ul>
  );
}
