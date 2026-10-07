'use client';

import { useEffect, useRef } from 'react';
import { projects } from '@/lib/projects';
import { CardFace } from './card';
import type { StoryControls } from './engine';

/**
 * The scroll track and the sticky stage the beats sit on. Server-rendered as
 * plain blocks: until `<html data-scenes>` is set they lay out as the calm,
 * stacked page, and with it they become layers the story drives. The field,
 * the card and the progress row are the story's own: one shape and one card
 * that travel between beats instead of each beat having its own.
 */
export function Story({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const html = document.documentElement;
    if (!track || !html.hasAttribute('data-scenes')) return;
    let story: StoryControls | null = null;
    let cancelled = false;

    // The story measures set type, so it waits for the display face.
    Promise.all([import('./engine'), document.fonts.ready]).then(([{ createStory }]) => {
      // The head script's failsafe may have given up on us while we loaded.
      if (cancelled || !html.hasAttribute('data-scenes')) return;
      // Development only: `?nosnap` parks the story between rests, so a frame
      // mid-move can be inspected.
      const snapping =
        process.env.NODE_ENV === 'production' || !/[?&]nosnap\b/.test(location.search);
      story = createStory(track, snapping);
      (window as unknown as { __story?: boolean }).__story = true;
    });

    return () => {
      cancelled = true;
      story?.kill();
    };
  }, []);

  return (
    <div className="story" ref={trackRef}>
      <div className="stage">
        {children}
        <div className="s-field" aria-hidden="true" />
        <div className="s-card" aria-hidden="true">
          <div className="s-card-tilt">
            <div className="card-frame s-card-inner">
              {projects.map((p) => (
                <span key={p.slug} className="s-layer">
                  <CardFace project={p} />
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* A pointer's shortcut and nothing more: a keyboard reaches each
            project by its own link, and the story brings it on screen. */}
        <div className="s-progress" aria-hidden="true">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className="s-sq"
              data-sq={i}
              tabIndex={-1}
              aria-label={`Show ${p.title}`}
            />
          ))}
          <span className="s-marker" />
        </div>
      </div>
    </div>
  );
}
