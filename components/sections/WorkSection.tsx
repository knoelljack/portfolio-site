import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import { fitLines } from '@/lib/fit';
import { ShotLayer } from './Shot';

const host = (link: string) => new URL(link).host.replace(/^www\./, '');

/** One word per line, every line solved to fill the text column. */
function Title({ title }: { title: string }) {
  const { ems, lines } = fitLines(title);

  return (
    <h3 className="project-title">
      <span className="sr-only">{title}</span>
      <span
        className="title-lines"
        style={{ '--ems': ems } as React.CSSProperties}
        aria-hidden="true"
      >
        {lines.map(({ word, wdth }) => (
          <span key={word} className="fit-mask">
            <span className="fit-line" style={{ '--wd': wdth } as React.CSSProperties}>
              {Array.from(word, (ch, i) => (
                <span key={i} className="ch">
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </h3>
  );
}

export function WorkSection() {
  return (
    <section
      id="work"
      className="scene scene-work"
      data-scene="work"
      aria-labelledby="work-heading"
    >
      <div className="shell work-shell">
        <header className="work-head">
          <h2 id="work-heading" className="t-label">
            Work
          </h2>
          <p className="work-lead">
            <span className="work-lead-main">Seven products, shipped.</span>{' '}
            <span className="work-lead-rest">
              Wealth management, transplant diagnostics, renewable energy, commerce, and a CarPlay
              app.
            </span>
          </p>
          {/* Only the story shows these: one per project, and the scroll
              moves the pixel along them. They are a pointer's shortcut and
              nothing more — a keyboard reaches each project by its own link,
              and the story brings it on screen — so they stay out of the tab
              order and the accessibility tree. */}
          <div className="work-ticks" aria-hidden="true">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className="work-tick"
                data-tick={i}
                tabIndex={-1}
                aria-label={`Show ${p.title}`}
              />
            ))}
            <span className="work-marker" aria-hidden="true" />
          </div>
        </header>

        <div className="work-body">
          <ol className="projects">
            {projects.map((p, i) => {
              const label = p.linkLabel ?? 'Visit site';
              return (
                <li key={p.slug} className="project" data-i={i}>
                  <div className="project-text">
                    <Title title={p.title} />
                    <p className="project-meta">
                      <span>{p.discipline}</span>
                      <span>{p.technologies.join(', ')}</span>
                    </p>
                    <p className="project-summary">{p.summary}</p>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      aria-label={`${label}: ${p.title}, opens in a new tab`}
                    >
                      {label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="project-shot" aria-hidden="true">
                    <span className="frame">
                      <span className="frame-bar t-tag">{host(p.link)}</span>
                      <span className="shot">
                        <ShotLayer project={p} sizes="(min-width: 900px) 50vw, 100vw" />
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
