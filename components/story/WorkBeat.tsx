import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import { fitLines } from '@/lib/fit';
import { Fitted } from './Fitted';
import { CardFace, posterColor } from './card';

/* The chapter word is set exactly as the reel sets it: across the whole grid,
   solved at the same width the reel's card settles to. */
const INTERFACES = fitLines(['Interfaces'], 0, 64);

/**
 * The work: a chapter card, then seven posters. Each poster is a colour field
 * bleeding off one side, the screenshot card pinned across its edge, and the
 * project in type on the white; alternate posters are mirrored.
 */
export function WorkBeat() {
  return (
    <section id="work" className="beat beat-work" aria-label="Work">
      <div className="interfaces" data-beat="interfaces">
        <div className="interfaces-field" aria-hidden="true" />
        <div className="shell interfaces-shell">
          <Fitted as="h2" fit={INTERFACES} label="Interfaces" className="interfaces-word" />
          <p className="interfaces-lead">
            <span className="lead-main">Seven products, shipped.</span>{' '}
            <span className="lead-rest">
              Wealth management, transplant diagnostics, renewable energy, commerce, and a CarPlay
              app.
            </span>
          </p>
        </div>
      </div>

      <ol className="posters">
        {projects.map((p, i) => {
          const label = p.linkLabel ?? 'Visit site';
          return (
            <li
              key={p.slug}
              className={`poster ${i % 2 ? 'is-b' : 'is-a'}`}
              data-i={i}
              style={{ '--c': posterColor(i) } as React.CSSProperties}
            >
              <div className="poster-field" aria-hidden="true" />
              <div className="poster-card" aria-hidden="true">
                <span className="card-frame">
                  <CardFace project={p} />
                </span>
              </div>
              <div className="poster-text">
                <Fitted
                  as="h3"
                  fit={fitLines(p.title.split(' '))}
                  label={p.title}
                  className="poster-title"
                />
                <p className="poster-meta">
                  <span>{p.discipline}</span>
                  <span>{p.technologies.join(', ')}</span>
                </p>
                <p className="poster-summary">{p.summary}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="poster-link"
                  aria-label={`${label}: ${p.title}, opens in a new tab`}
                >
                  {label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
