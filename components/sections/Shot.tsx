'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/types';

/** Drive Stories ships in the App Store and has no site to screenshot, so its
    frame says so in type rather than leaving an empty well. */
function Plate({ project }: { project: Project }) {
  return (
    <span className="shot-plate">
      <span className="t-label">Ships in the App Store</span>
      <span className="plate-title">{project.title}</span>
    </span>
  );
}

/** One screenshot, masked so it can construct itself column by column. */
export function ShotLayer({
  project,
  sizes,
  eager = false,
  active = true,
  previous = false,
}: {
  project: Project;
  sizes: string;
  eager?: boolean;
  active?: boolean;
  previous?: boolean;
}) {
  return (
    <span
      className="shot-layer"
      data-active={active || undefined}
      data-prev={previous || undefined}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          className="object-cover object-top"
        />
      ) : (
        <Plate project={project} />
      )}
    </span>
  );
}

/** An inline screenshot that constructs itself once, on its way into view. */
export function Shot({ project }: { project: Project }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.setAttribute('data-armed', '');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute('data-in', '');
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span className="shot" ref={ref}>
      {/* Hidden wherever the adjacent preview shows — and Chrome still fetches
          a lazy image near the viewport while it is display:none — so the
          first size tells it the hidden copy needs a pixel, not a 1920 JPEG. */}
      <ShotLayer
        project={project}
        sizes="(min-width: 1100px) and (hover: hover) and (pointer: fine) 1px, (min-width: 768px) 90vw, 100vw"
      />
    </span>
  );
}
