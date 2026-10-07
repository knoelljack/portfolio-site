'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Letters (`.ch`) inside `ref` swell along the width axis toward the pointer —
 * or a finger dragged across them — while the rest of their line gives up
 * exactly the width they take, so a fitted line never leaves its box. Each
 * letter's growth is weighted by its own width, which tracks its advance per
 * unit of wdth closely enough to hold the line to a pixel.
 *
 * `area` is the closest ancestor matching the selector: the region the pointer
 * is read over.
 */
export function useSwell(ref: RefObject<HTMLElement | null>, area: string, amount: number) {
  useEffect(() => {
    const root = ref.current;
    const region = root?.closest<HTMLElement>(area);
    if (!root || !region || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>('.ch'));
    let base: number[] = [];
    let now: number[] = [];
    let cx: number[] = [];
    let cy: number[] = [];
    let weight: number[] = [];
    let line: number[] = [];
    let lines = 0;
    let height = 1;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    const measure = () => {
      for (const l of letters) l.style.removeProperty('--wd');
      base = letters.map((l) => parseFloat(getComputedStyle(l).getPropertyValue('--wd')) || 100);
      now = base.slice();
      const rects = letters.map((l) => l.getBoundingClientRect());
      cx = rects.map((r) => r.left + r.width / 2 + window.scrollX);
      cy = rects.map((r) => r.top + r.height / 2 + window.scrollY);
      weight = rects.map((r) => r.width);
      height = rects[0]?.height || 1;
      const tops = Array.from(new Set(rects.map((r) => Math.round(r.top))));
      line = rects.map((r) => tops.indexOf(Math.round(r.top)));
      lines = tops.length;
    };

    const frame = () => {
      raf = 0;
      const goal = base.slice();
      if (pointer) {
        const pull = letters.map((_, i) => {
          const dx = (cx[i] - window.scrollX - pointer!.x) / (height * 0.9);
          const dy = (cy[i] - window.scrollY - pointer!.y) / (height * 1.4);
          return Math.exp(-dx * dx - dy * dy);
        });
        for (let k = 0; k < lines; k++) {
          let num = 0;
          let den = 0;
          letters.forEach((_, i) => {
            if (line[i] !== k) return;
            num += weight[i] * pull[i];
            den += weight[i];
          });
          const mean = den ? num / den : 0;
          letters.forEach((_, i) => {
            if (line[i] === k) goal[i] = base[i] + amount * (pull[i] - mean);
          });
        }
      }

      let moving = false;
      letters.forEach((l, i) => {
        const next = now[i] + (goal[i] - now[i]) * 0.16;
        now[i] = Math.abs(goal[i] - next) < 0.05 ? goal[i] : next;
        if (now[i] !== goal[i]) moving = true;
        l.style.setProperty('--wd', Math.min(200, Math.max(50, now[i])).toFixed(2));
      });
      if (moving || pointer) raf = requestAnimationFrame(frame);
      else for (const l of letters) l.style.removeProperty('--wd');
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (document.documentElement.hasAttribute('data-intro')) return;
      if (e.pointerType !== 'mouse' && e.buttons === 0) return;
      pointer = { x: e.clientX, y: e.clientY };
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    measure();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = 0;
      pointer = null;
      measure();
    });
    ro.observe(root);
    region.addEventListener('pointermove', onMove);
    region.addEventListener('pointerleave', onLeave);
    region.addEventListener('pointerup', onLeave);
    region.addEventListener('pointercancel', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      region.removeEventListener('pointermove', onMove);
      region.removeEventListener('pointerleave', onLeave);
      region.removeEventListener('pointerup', onLeave);
      region.removeEventListener('pointercancel', onLeave);
      for (const l of letters) l.style.removeProperty('--wd');
    };
  }, [ref, area, amount]);
}
