'use client';

import { useEffect, useRef, useState } from 'react';

const MAIN = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const;

const MORE = [
  ['Resume', '/resume.pdf'],
  ['GitHub', 'https://github.com/knoelljack'],
  ['LinkedIn', 'https://www.linkedin.com/in/jackknoell/'],
  ['knoelljack@gmail.com', 'mailto:knoelljack@gmail.com'],
] as const;

/** Twelve columns on a wide screen and four on a tall one; the stylesheet
    hides the ones a tall screen has no room for. */
const COLUMNS = 12;

/**
 * The only chrome: a button that floods the screen in columns, as the reel
 * does, over a short index. Choosing a place jumps there under the cover, so
 * the flood drains away onto the destination instead of a long scroll to it.
 */
export function Menu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const main = document.querySelector('main');
    const button = buttonRef.current;
    // The page behind the cover leaves the tab order, so focus stays between
    // the button and the index.
    main?.setAttribute('inert', '');
    html.style.overflow = 'hidden';
    navRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      main?.removeAttribute('inert');
      html.style.removeProperty('overflow');
      window.removeEventListener('keydown', onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant',
        });
        history.replaceState(null, '', href);
        window.dispatchEvent(new Event('story:jump'));
      }
    }
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((o) => !o)}
        data-reel-in
      >
        <span className="menu-sq" aria-hidden="true" />
        {open ? 'Close' : 'Menu'}
      </button>
      <div id="menu" className="menu" data-open={open || undefined}>
        <div className="menu-cols" aria-hidden="true">
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span key={i} className="menu-col" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <nav className="menu-nav shell" aria-label="Primary" ref={navRef}>
          <ul className="menu-main">
            {MAIN.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={(e) => go(e, href)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="menu-more">
            {MORE.map(([label, href]) => {
              const external = href.startsWith('http') || href.endsWith('.pdf');
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => go(e, href)}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
