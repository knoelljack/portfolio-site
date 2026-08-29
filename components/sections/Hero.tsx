import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * Placed by eye against things on the page — the eyebrow, the end of the
 * button row — rather than scattered into open space, where
 * they read as dust instead of as marks. Offsets are measured from the
 * content column, so they hold their relationships at every width. See
 * `.pixel` in globals.css.
 */
const PIXELS = [
  { top: '0.25rem', left: '-1.25rem', rotate: '12deg' },
  { bottom: '-1.5rem', left: '15.5rem', rotate: '22deg' },
];

export function Hero() {
  return (
    <header id="top" className="shell">
      <div className="indent pb-24 pt-20 md:pb-32 md:pt-36">
        <div className="relative">
          {PIXELS.map(({ rotate, ...position }, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="pixel"
              style={{ ...position, transform: `rotate(${rotate})` }}
            />
          ))}

          <p className="mono">Full-stack engineer — Irvine, California</p>

          <h1 className="t-hero duo mt-7 max-w-[30ch] md:mt-9">
            <b>Jack Knoell builds interfaces and the systems under them.</b> Component architecture,
            CMS modeling, and the serverless APIs behind both.
          </h1>

          <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11">
            <a href="#work" className="btn btn-solid">
              See the work
              <ArrowRight className="nudge h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
