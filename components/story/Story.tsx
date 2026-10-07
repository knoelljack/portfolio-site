'use client';

import { useEffect, useRef } from 'react';
import type { StoryControls } from './engine';

/**
 * The scroll track and the sticky stage the scenes sit on. Server-rendered as
 * plain blocks: until `<html data-scenes>` is set they lay out as an ordinary
 * stacked page, and with it they become layers the story drives.
 */
export function Story({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const html = document.documentElement;
    if (!track || !html.hasAttribute('data-scenes')) return;
    let story: StoryControls | null = null;
    let cancelled = false;

    // The story measures the hero's set type, so it waits for the display face.
    Promise.all([import('./engine'), document.fonts.ready]).then(([{ createStory }]) => {
      // The head script's failsafe may have given up on us while we loaded.
      if (cancelled || !html.hasAttribute('data-scenes')) return;
      story = createStory(track);
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
        <span className="story-pixel" aria-hidden="true" />
        <span className="story-box" aria-hidden="true" />
      </div>
    </div>
  );
}
