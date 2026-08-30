'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MARK_PATHS } from './stack-marks';

/**
 * The stack, as content: every entry is a focusable name, and the canvas beside
 * it is decoration that follows whichever name the reader is on. `slug` keys
 * into the vendored simple-icons geometry; `null` means the technology has no
 * clean official mark, so the stage sets its name as a pixel plate instead —
 * the same fallback the work index uses for Drive Stories.
 */
const STACK = [
  [
    'Languages',
    [
      ['TypeScript', 'typescript'],
      ['JavaScript', 'javascript'],
      ['SQL', null],
      ['Liquid', null],
    ],
  ],
  [
    'Frameworks',
    [
      ['React', 'react'],
      ['Next.js', 'nextdotjs'],
      ['React Native', null],
      ['Node.js', 'nodedotjs'],
    ],
  ],
  [
    'Styling',
    [
      ['Tailwind', 'tailwindcss'],
      ['Sass', 'sass'],
      ['CSS', 'css'],
      ['Figma', 'figma'],
    ],
  ],
  [
    'Data',
    [
      ['GraphQL', 'graphql'],
      ['Contentful', 'contentful'],
      ['DatoCMS', 'datocms'],
      ['AEM', null],
      ['MongoDB', 'mongodb'],
    ],
  ],
  [
    'Testing',
    [
      ['Vitest', 'vitest'],
      ['Storybook', 'storybook'],
      ['GitHub Actions', 'githubactions'],
    ],
  ],
  [
    'Platform',
    [
      ['Vercel', 'vercel'],
      ['Cloudflare Workers', 'cloudflareworkers'],
      ['Shopify', 'shopify'],
    ],
  ],
] as const satisfies readonly (readonly [string, readonly (readonly [string, string | null])[]])[];

type Tech = { label: string; slug: string | null; group: string };

const TECHS: Tech[] = STACK.flatMap(([group, items]) =>
  items.map(([label, slug]) => ({ label, slug, group }))
);

let cursor = 0;
const GROUPS = STACK.map(([group, items]) => ({
  group,
  items: items.map(([label]) => ({ label, index: cursor++ })),
}));

/* The stage samples marks onto a GRID x GRID lattice, so a particle is always a
   whole cell — the field can never drift off the grid it was cut from. */
const GRID = 52;
const MAX_PARTICLES = 1000;
const MORPH_MS = 640;
const STAGGER_MS = 160;
const IDLE_MS = 3400;
/* A tap has no "leave", so a pinned name releases itself rather than freezing
   the stage for the rest of the session. */
const PIN_RELEASE_MS = 9000;

/* Predominantly ink with a thinning tail of grey: the mark has to read as one
   shape first and as texture second. */
const TONES = [
  [17, 17, 20],
  [27, 27, 32],
  [42, 42, 49],
  [74, 74, 82],
  [116, 116, 124],
] as const;
const TONE_WEIGHTS = [0.44, 0.24, 0.16, 0.1, 0.06];
const ACCENT = [65, 55, 255] as const;
const BLENDS = 8;

/** One string per (tone, accent blend), built once so the draw loop never has
    to construct — or reparse — a colour. */
const COLOR_TABLE = TONES.map((tone) =>
  Array.from({ length: BLENDS }, (_, b) => {
    const k = b / (BLENDS - 1);
    const c = tone.map((v, i) => Math.round(v + (ACCENT[i] - v) * k));
    return `rgb(${c[0]} ${c[1]} ${c[2]})`;
  })
);

type Particle = {
  cx: number;
  cy: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  ax: number;
  ay: number;
  delay: number;
  flash: number;
  live: boolean;
  tone: number;
};

type Engine = {
  morphTo: (index: number) => void;
  wake: () => void;
  sleep: () => void;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Drift, then run in and stop dead. The first third barely closes any
    distance — that is the swarm — and the rest lands on a hard deceleration so
    the arrival reads as precision rather than as a float. */
function shape(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.35) return 0.12 * (t / 0.35) ** 1.6;
  const u = (t - 0.35) / 0.65;
  return 0.12 + 0.88 * (1 - (1 - u) ** 4);
}

function pickTone(r: number) {
  let acc = 0;
  for (let i = 0; i < TONE_WEIGHTS.length; i++) {
    acc += TONE_WEIGHTS[i];
    if (r < acc) return i;
  }
  return TONE_WEIGHTS.length - 1;
}

function drawPlate(ctx: CanvasRenderingContext2D, label: string) {
  const inset = GRID * 0.08;
  ctx.lineWidth = GRID * 0.03;
  ctx.strokeStyle = '#000';
  ctx.strokeRect(inset, inset, GRID - inset * 2, GRID - inset * 2);

  const lines = label.toUpperCase().split(' ');
  const boxW = GRID - inset * 2 - GRID * 0.2;
  const boxH = GRID - inset * 2 - GRID * 0.18;
  const font = (size: number) => `700 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;

  ctx.font = font(20);
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const size = Math.min(GRID * 0.34, (20 * boxW) / widest, boxH / (lines.length * 1.2));

  ctx.font = font(size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lh = size * 1.15;
  const top = GRID / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, GRID / 2, top + i * lh));
}

/** 4x4 ordered dither. When a mark fills more cells than the pool has
    particles, thinning on a Bayer threshold keeps coverage even instead of
    eating one edge of the shape. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Rasterise a mark offscreen at lattice resolution and return the cells it
    fills, in row-major order. Two marks sampled this way stay in rough
    correspondence, so particle *i* travels between neighbouring parts of the
    two shapes rather than across the whole field. */
function sampleMark(tech: Tech): Int16Array {
  const c = document.createElement('canvas');
  c.width = GRID;
  c.height = GRID;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Int16Array(0);

  ctx.fillStyle = '#000';
  if (tech.slug) {
    const pad = GRID * 0.09;
    const s = (GRID - pad * 2) / 24;
    ctx.setTransform(s, 0, 0, s, pad, pad);
    ctx.fill(new Path2D(MARK_PATHS[tech.slug]));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    drawPlate(ctx, tech.label);
  }

  const { data } = ctx.getImageData(0, 0, GRID, GRID);
  const cells: number[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (data[(y * GRID + x) * 4 + 3] > 120) cells.push(x, y);
    }
  }

  const count = cells.length / 2;
  if (count <= MAX_PARTICLES) return Int16Array.from(cells);

  const keep = MAX_PARTICLES / count;
  const thinned: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = cells[i * 2];
    const y = cells[i * 2 + 1];
    if (BAYER[(y % 4) * 4 + (x % 4)] / 16 < keep) thinned.push(x, y);
  }
  return Int16Array.from(thinned);
}

export function StackMorph() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reduced, setReduced] = useState(false);
  const [awake, setAwake] = useState(false);
  const [idle, setIdle] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const active = hovered ?? pinned ?? idle;
  const tech = TECHS[active];
  const engaged = hovered !== null || pinned !== null;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* The stage only runs while it is on screen and the tab is in front. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let onScreen = false;
    const sync = () => setAwake(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '96px' }
    );
    io.observe(stage);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  /* No idle cycle under reduced motion: the stage holds whatever the reader
     last asked for, and changes only when they ask again. */
  useEffect(() => {
    if (!awake || engaged || reduced) return;
    const id = setInterval(() => setIdle((i) => (i + 1) % TECHS.length), IDLE_MS);
    return () => clearInterval(id);
  }, [awake, engaged, reduced]);

  /* Handing the index back to the idle cursor on the way out is what stops the
     cycle from snapping to the top of the list the moment a reader looks away. */
  const release = useCallback((index: number) => {
    setHovered(null);
    setIdle(index);
  }, []);

  const pin = useCallback((index: number) => {
    setPinned(index);
    if (pinTimer.current) clearTimeout(pinTimer.current);
    pinTimer.current = setTimeout(() => {
      setPinned(null);
      setIdle(index);
    }, PIN_RELEASE_MS);
  }, []);

  useEffect(
    () => () => {
      if (pinTimer.current) clearTimeout(pinTimer.current);
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rand = mulberry32(0x5eed);
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => {
      const tone = pickTone(rand());
      const a = rand() * Math.PI * 2;
      const d = GRID * (0.55 + rand() * 0.35);
      return {
        cx: GRID / 2 + Math.cos(a) * d,
        cy: GRID / 2 + Math.sin(a) * d,
        fx: 0,
        fy: 0,
        tx: 0,
        ty: 0,
        ax: 0,
        ay: 0,
        delay: 0,
        flash: 0,
        live: false,
        tone,
      };
    });

    const cache = new Map<number, Int16Array>();
    const targetsFor = (index: number) => {
      let cells = cache.get(index);
      if (!cells) {
        cells = sampleMark(TECHS[index]);
        cache.set(index, cells);
      }
      return cells;
    };

    let cssW = 0;
    let cssH = 0;
    let raf = 0;
    let start = 0;
    let morphing = false;
    let live = true;
    let running = false;

    const paint = (now: number) => {
      if (!cssW || !cssH) return;
      const field = Math.min(cssW, cssH) * 0.9;
      const cell = field / GRID;
      const sq = Math.max(2, Math.round(cell * 0.64));
      const ox = (cssW - field) / 2;
      const oy = (cssH - field) / 2;

      ctx.clearRect(0, 0, cssW, cssH);
      let alpha = 1;
      ctx.globalAlpha = 1;
      let settled = true;

      for (const p of particles) {
        let a = p.live ? 1 : 0;
        let mix = 0;

        if (morphing) {
          const t = Math.min(1, Math.max(0, (now - start - p.delay) / MORPH_MS));
          if (t < 1) settled = false;
          const e = shape(t);
          const arc = Math.sin(Math.PI * t);
          p.cx = p.fx + (p.tx - p.fx) * e + p.ax * arc;
          p.cy = p.fy + (p.ty - p.fy) * e + p.ay * arc;
          mix = arc ** 1.3 * p.flash * 0.82;
          a = p.live ? 1 : 1 - e;
        }

        if (a < 0.05) continue;
        const q = a < 1 ? Math.round(a * 6) / 6 : 1;
        if (q !== alpha) {
          ctx.globalAlpha = q;
          alpha = q;
        }
        ctx.fillStyle = COLOR_TABLE[p.tone][Math.min(BLENDS - 1, (mix * BLENDS) | 0)];
        ctx.fillRect(
          Math.round(ox + (p.cx + 0.5) * cell - sq / 2),
          Math.round(oy + (p.cy + 0.5) * cell - sq / 2),
          sq,
          sq
        );
      }
      ctx.globalAlpha = 1;

      if (morphing && settled) {
        morphing = false;
        for (const p of particles) {
          p.cx = p.tx;
          p.cy = p.ty;
        }
      }
    };

    /* The loop exists only while a morph is in flight and the stage is awake:
       a settled field is a still image, and still images do not need frames. */
    const tick = (now: number) => {
      paint(now);
      raf = morphing && running && live ? requestAnimationFrame(tick) : 0;
    };

    const morphTo = (index: number) => {
      const cells = targetsFor(index);
      const count = cells.length / 2;
      const mid = GRID / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.fx = p.cx;
        p.fy = p.cy;
        p.live = i < count;

        if (p.live) {
          p.tx = cells[i * 2];
          p.ty = cells[i * 2 + 1];
        } else {
          /* No cell to occupy: leave the field along the line it is already on,
             so the surplus reads as the mark shedding mass, not as dust. */
          const dx = p.fx - mid || 0.001;
          const dy = p.fy - mid;
          const len = Math.hypot(dx, dy) || 1;
          p.tx = mid + (dx / len) * GRID * 0.78;
          p.ty = mid + (dy / len) * GRID * 0.78;
        }

        const dx = p.tx - p.fx;
        const dy = p.ty - p.fy;
        const len = Math.hypot(dx, dy);
        const k = (Math.random() * 2 - 1) * Math.min(len * 0.3, GRID * 0.14);
        p.ax = len ? (-dy / len) * k : 0;
        p.ay = len ? (dx / len) * k : 0;
        /* Only travellers carry the accent, and only while they travel. */
        p.flash = Math.min(1, len / 5);
        p.delay = (p.ty / GRID) * STAGGER_MS * 0.55 + Math.random() * STAGGER_MS * 0.45;
      }

      if (reduced) {
        morphing = false;
        for (const p of particles) {
          p.cx = p.tx;
          p.cy = p.ty;
        }
        paint(0);
        return;
      }

      start = performance.now();
      morphing = true;
      if (!raf && running) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    engineRef.current = {
      morphTo,
      wake: () => {
        running = true;
        if (morphing && !raf) raf = requestAnimationFrame(tick);
      },
      sleep: () => {
        running = false;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
    };

    return () => {
      live = false;
      engineRef.current = null;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (awake) engine.wake();
    else engine.sleep();
    /* `reduced` rebuilds the engine below, so this has to re-run and hand the
       replacement its running state. */
  }, [awake, reduced]);

  useEffect(() => {
    if (awake || reduced) engineRef.current?.morphTo(active);
  }, [active, awake, reduced]);

  return (
    <div className="stack-grid">
      <div className="stack-stage-col">
        <div className="stack-stage" ref={stageRef}>
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
        <p className="mono stack-caption">{tech.label}</p>
      </div>

      <div className="stack-list-col">
        {/* Read once in reading order rather than hung off all 23 buttons as a
            description a screen reader would then repeat on every one. */}
        <p className="sr-only">
          Selecting a technology draws its mark on the panel beside this list.
        </p>
        {GROUPS.map(({ group, items }) => (
          <div key={group} className="stack-group">
            <p className="mono">{group}</p>
            <ul className="stack-names">
              {items.map(({ label, index }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="stack-name"
                    aria-pressed={active === index}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(index)}
                    onPointerLeave={(e) => e.pointerType === 'mouse' && release(index)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => release(index)}
                    onClick={() => pin(index)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
