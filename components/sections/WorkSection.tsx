'use client';

import { useState, useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import type { Project } from '@/lib/types';
import { Chapter } from './Chapter';
import { Shot, ShotLayer } from './Shot';

const host = (link: string) => new URL(link).host.replace(/^www\./, '');

/** Must match the media query that shows `.preview-col` in globals.css. */
const PREVIEW_QUERY = '(min-width: 1100px) and (hover: hover) and (pointer: fine)';

const subscribe = (onChange: () => void) => {
  const mq = matchMedia(PREVIEW_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/**
 * Every project is mounted at once, so the screenshots decode before the first
 * hover. The raised one constructs itself over the one it replaces, which holds
 * still underneath until it is covered — a swap never flashes the empty frame.
 *
 * The screenshots mount only where the preview is shown, and load eagerly
 * there: seven stacked, mostly-masked frames are exactly what native lazy
 * loading misjudges, and a touch screen should not pay for them at all.
 */
function Preview({ active, previous }: { active: string; previous: string | null }) {
  const project = projects.find((p) => p.slug === active);
  const shown = useSyncExternalStore(
    subscribe,
    () => matchMedia(PREVIEW_QUERY).matches,
    () => false
  );

  return (
    // The grid item is the outer column, stretched to the height of the
    // index; the sticky box has to be a shorter child inside it, or it has
    // no room to travel and never sticks at all.
    <div className="preview-col" aria-hidden="true">
      <div className="preview">
        <div className="shot">
          {shown &&
            projects.map((p) => (
              <ShotLayer
                key={p.slug}
                project={p}
                sizes="(min-width: 1600px) 520px, 33vw"
                eager
                active={p.slug === active}
                previous={p.slug === previous}
              />
            ))}
        </div>
        <p className="inspect t-tag">
          <span>{project?.title}</span>
          <span>{project ? host(project.link) : ''}</span>
        </p>
        <p className="preview-summary">{project?.summary}</p>
      </div>
    </div>
  );
}

function Row({
  project,
  active,
  onEnter,
}: {
  project: Project;
  active: boolean;
  onEnter: () => void;
}) {
  const label = project.linkLabel ?? 'Visit site';

  return (
    <li>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="work-row"
        data-active={active || undefined}
        onMouseEnter={onEnter}
        onFocus={onEnter}
        aria-label={`${project.title} — ${project.discipline}. ${label}, opens in a new tab.`}
      >
        <span className="work-title">{project.title}</span>
        <ArrowUpRight className="work-arrow h-5 w-5" aria-hidden="true" />
        <span className="work-meta">
          <span>{project.discipline}</span>
          <span>{project.technologies.join(', ')}</span>
        </span>
        {/* The adjacent preview never fires on a touch screen or a narrow one,
            so the summary and the screenshot ship in the row there instead. */}
        <span className="work-summary">{project.summary}</span>
        <span className="work-shot">
          <Shot project={project} />
        </span>
      </a>
    </li>
  );
}

export function WorkSection() {
  const [active, setActive] = useState(projects[0].slug);
  const [previous, setPrevious] = useState<string | null>(null);

  const raise = (slug: string) => {
    if (slug === active) return;
    setPrevious(active);
    setActive(slug);
  };

  return (
    <section id="work" className="section shell">
      <Chapter word="Work" />

      <div className="section-lead">
        <p className="t-lead">Seven products, shipped.</p>
        <p className="t-body">
          Wealth management, transplant diagnostics, renewable energy, commerce, and a CarPlay app.
        </p>
      </div>

      <div className="work-body">
        <ul className="work-list">
          {projects.map((project) => (
            <Row
              key={project.slug}
              project={project}
              active={project.slug === active}
              onEnter={() => raise(project.slug)}
            />
          ))}
        </ul>

        <Preview active={active} previous={previous} />
      </div>
    </section>
  );
}
