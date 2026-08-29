'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import type { Project } from '@/lib/types';

function Plate({ project }: { project: Project }) {
  return (
    <div className="preview-plate">
      <span className="mono">Ships in the App Store</span>
      <span className="t-lead">{project.title}</span>
      <span
        aria-hidden="true"
        className="pixel"
        style={{ bottom: '1.25rem', right: '1.25rem', transform: 'rotate(16deg)' }}
      />
    </div>
  );
}

/**
 * Every project is mounted at once and cross-faded by opacity, so the
 * screenshots decode before the first hover and the preview lands
 * immediately instead of flashing an empty frame. It is seeded with the
 * first project and holds whatever was raised last — an empty well beside
 * a full index reads as something failing to load.
 */
function Preview({ activeSlug }: { activeSlug: string }) {
  const active = projects.find((p) => p.slug === activeSlug);
  const index = projects.findIndex((p) => p.slug === activeSlug);

  return (
    // The grid item is the outer column, stretched to the height of the
    // index; the sticky box has to be a shorter child inside it, or it has
    // no room to travel and never sticks at all.
    <div className="preview-col" aria-hidden="true">
      <div className="preview">
        <div className="preview-frame">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="absolute inset-0 transition-opacity duration-150"
              style={{ opacity: project.slug === activeSlug ? 1 : 0 }}
            >
              {project.image ? (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="26rem"
                  className="object-cover object-top"
                />
              ) : (
                <Plate project={project} />
              )}
            </div>
          ))}
        </div>
        <p className="mono mt-3">
          {String(index + 1).padStart(2, '0')} — {active?.title}
        </p>
        <p className="preview-summary">{active?.summary ?? ''}</p>
      </div>
    </div>
  );
}

function Row({
  project,
  index,
  onEnter,
}: {
  project: Project;
  index: number;
  onEnter: () => void;
}) {
  const label = project.linkLabel ?? 'Visit site';

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="work-row"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      aria-label={`${project.title} — ${project.discipline}. ${label}, opens in a new tab.`}
    >
      <span className="mono work-idx" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="t-row work-title">{project.title}</span>

      <span className="mono work-meta">
        {project.discipline}
        <span className="work-tech">{project.technologies.join(', ')}</span>
      </span>

      {/* Screenshots have to reach a touch device somehow, and the adjacent
          preview never fires there — so a thumbnail ships inline instead. */}
      {project.image ? (
        <span className="work-thumb">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="120px"
            className="object-cover object-top"
          />
        </span>
      ) : null}

      <span className="work-end">
        <ArrowUpRight className="nudge h-4 w-4 text-[var(--ink-3)]" aria-hidden="true" />
      </span>
    </a>
  );
}

export function WorkSection() {
  const [activeSlug, setActiveSlug] = useState(projects[0].slug);

  return (
    <section id="work" className="shell">
      <div className="indent pb-20 md:pb-28">
        <div className="flex items-baseline justify-between">
          <p className="mono">Selected work</p>
          <p className="mono">{String(projects.length).padStart(2, '0')}</p>
        </div>

        <h2 className="t-lead duo mt-6 max-w-[46ch]">
          <b>Seven products, shipped.</b> Wealth management, transplant diagnostics, renewable
          energy, commerce, and a CarPlay app.
        </h2>

        <div className="work-body mt-10 md:mt-12">
          <div>
            {projects.map((project, i) => (
              <Row
                key={project.slug}
                project={project}
                index={i}
                onEnter={() => setActiveSlug(project.slug)}
              />
            ))}
          </div>

          <Preview activeSlug={activeSlug} />
        </div>
      </div>
    </section>
  );
}
