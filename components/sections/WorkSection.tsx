'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import type { Project } from '@/lib/types';

/** Matches the `:root` fallbacks in globals.css. */
const REST_ACCENT = '122 126 142';
const REST_ACCENT_UI = '14 14 17';

function Panel({
  project,
  index,
  isActive,
}: {
  project: Project;
  index: number;
  isActive: boolean;
}) {
  const label = project.linkLabel ?? 'Visit site';

  return (
    <a
      data-panel
      data-active={isActive || undefined}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="panel group"
      style={
        {
          '--accent': project.accent,
          '--accent-ui': project.accentUi ?? project.accent,
        } as React.CSSProperties
      }
      aria-label={`${project.title} — ${project.discipline}. ${label}, opens in a new tab.`}
    >
      <div className="panel-shot">
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={`The ${project.title} website`}
              fill
              sizes="(max-width: 900px) 88vw, min(64vw, 900px)"
              className="object-cover object-top"
              priority={index < 2}
            />
            <span className="panel-veil" aria-hidden="true" />
          </>
        ) : (
          /* No website to screenshot — a typographic plate instead of an
             empty image well. */
          <div
            className="absolute inset-0 flex flex-col justify-between p-8 md:p-12"
            style={{ background: 'rgb(var(--accent))', color: '#fff' }}
          >
            {/* The discipline and title are already in the meta below, so the
                plate carries the one thing the other panels can't say: why
                there is no screenshot here. */}
            <span className="mono" style={{ color: 'rgb(255 255 255 / 0.7)' }}>
              Ships in the App Store
            </span>
            <span className="display t-panel" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
              {project.title}
            </span>
          </div>
        )}
      </div>

      <div className="panel-meta">
        <div className="min-w-0">
          <p className="mono">
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')} — </span>
            {project.discipline}
          </p>
          <h3 className="display t-panel mt-2">{project.title}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <span className="disc" aria-hidden="true">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </a>
  );
}

export function WorkSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Which panel is most visible in the rail.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const panels = Array.from(rail.querySelectorAll('[data-panel]'));
    const ratios = new Map<Element, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let best = 0;
        let bestRatio = -1;
        panels.forEach((panel, i) => {
          const ratio = ratios.get(panel) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = i;
          }
        });
        setActive(best);
      },
      { root: rail, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    panels.forEach((panel) => io.observe(panel));
    return () => io.disconnect();
  }, []);

  // Only tint the page while the rail is actually on screen — otherwise the
  // hero and contact sections inherit a colour that belongs to a client.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const { style } = document.documentElement;
    const project = projects[active];
    style.setProperty('--accent', inView ? project.accent : REST_ACCENT);
    style.setProperty(
      '--accent-ui',
      inView ? (project.accentUi ?? project.accent) : REST_ACCENT_UI
    );
  }, [active, inView]);

  useEffect(() => {
    const { style } = document.documentElement;
    return () => {
      style.removeProperty('--accent');
      style.removeProperty('--accent-ui');
    };
  }, []);

  const go = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const panels = rail.querySelectorAll('[data-panel]');
    const target = panels[Math.max(0, Math.min(panels.length - 1, index))];
    target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(active - 1);
    }
  };

  return (
    <section ref={sectionRef} id="work" className="py-20 md:py-24">
      <div className="shell">
        <hr className="rule" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono">Selected work</p>
            <h2 className="display t-section mt-4">
              Seven brands, <em>one build.</em>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="mono tabular-nums" aria-live="polite">
              {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              className="disc disabled:opacity-30"
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === projects.length - 1}
              className="disc disabled:opacity-30"
              aria-label="Next project"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="rail mt-10 md:mt-12"
        tabIndex={0}
        role="group"
        aria-label="Selected work — scroll horizontally"
        onKeyDown={onKeyDown}
      >
        {projects.map((project, i) => (
          <Panel key={project.slug} project={project} index={i} isActive={i === active} />
        ))}
      </div>
    </section>
  );
}
