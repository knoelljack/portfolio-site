'use client';

import { useEffect, useRef } from 'react';
import { getImageProps } from 'next/image';
import { projects } from '@/lib/projects';
import { createReel, type ReelControls } from './engine';

/** The screenshots at roughly the size the reel's boxes show them, through the
    image optimiser rather than as the 1920px originals. */
const SHOTS = projects.map(({ title, image }) => ({
  title,
  src: image ? getImageProps({ src: image, alt: '', width: 414, height: 259 }).props.src : null,
}));

/** The reel opens on type set in the display face and measures it, so it waits
    for the face — but never for long: a slow font costs the reel, not the page. */
function fontsReady() {
  const glyph = document.querySelector('[data-reel-name] .ch');
  const family = glyph ? getComputedStyle(glyph).fontFamily : null;
  const loads: Promise<unknown>[] = [document.fonts.ready];
  if (family) loads.push(document.fonts.load(`800 100px ${family}`));
  return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 1600))]);
}

/**
 * The overlay is server-rendered so the reel's first frame is the page's first
 * paint, but it only shows while `<html data-intro>` is set — by the gate in
 * the layout's head before paint, and removed here when the reel lets go.
 */
export function Reel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const controls = useRef<ReelControls | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;

    const start = async () => {
      html.setAttribute('data-intro', 'run');
      history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, behavior: 'instant' });
      const images = SHOTS.map(({ src }) => {
        if (!src) return null;
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        return img;
      });

      await fontsReady();
      // Skipped while the fonts were still on their way.
      if (cancelled || !html.hasAttribute('data-intro')) return;

      const works = SHOTS.map(({ title }, i) => ({ title, image: images[i] }));
      controls.current = createReel(root, works, () => {
        controls.current = null;
        html.removeAttribute('data-intro');
      });

      if (process.env.NODE_ENV !== 'production') {
        const reel = controls.current;
        const at = new URLSearchParams(location.search).get('introAt');
        if (at) {
          reel.freeze(Number(at));
          await Promise.all(images.map((img) => img?.decode().catch(() => null)));
          reel.freeze(Number(at));
        }
        (window as unknown as { __reel?: ReelControls }).__reel = reel;
      }
    };

    if (html.getAttribute('data-intro') === 'play') {
      // Past the head script's failsafe the page has already let itself go,
      // and the reader may be reading: a reel arriving now would only get in
      // the way. Replay is still there in the footer.
      if (performance.now() > 5500) html.removeAttribute('data-intro');
      else start();
    }

    const replay = () => {
      if (html.hasAttribute('data-intro')) return;
      start();
    };
    window.addEventListener('reel:replay', replay);

    return () => {
      cancelled = true;
      window.removeEventListener('reel:replay', replay);
      // Interrupted rather than finished (a remount): leave the gate as the
      // head script set it, so the next mount plays from the top.
      if (html.hasAttribute('data-intro')) {
        controls.current?.kill();
        controls.current = null;
        html.setAttribute('data-intro', 'play');
      }
    };
  }, []);

  const skip = () => {
    if (controls.current) controls.current.skip();
    else document.documentElement.removeAttribute('data-intro');
  };

  return (
    <>
      <div className="reel" ref={rootRef} aria-hidden="true">
        <div className="reel-stage" />
      </div>
      <button type="button" className="reel-skip" onClick={skip}>
        Skip intro
        <span className="reel-skip-bar" aria-hidden="true" />
      </button>
    </>
  );
}
