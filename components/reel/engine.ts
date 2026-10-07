import gsap from 'gsap';
import { MARK_PATHS } from '@/components/sections/stack-marks';
import { cellsOf, coverage, tilesOf } from './raster';
import { createPointLayer, STRIDE, type PointLayer } from './points';

/**
 * The opening reel: five seconds that build the page from a single pixel.
 *
 *   pixel → grid → flood → "Interfaces" → the work, laid out and reflowed →
 *   pixelated, shattered, swirled → "Systems" → React, Next.js, TypeScript →
 *   the name, landing as pixel type exactly where the hero sets it.
 *
 * Every frame is a pure function of the playhead. GSAP owns the DOM beats and
 * the particle field is recomputed from `t` alone, so skipping is a seek and a
 * frame can be inspected by seeking to it.
 */

export type ReelWork = { title: string; image: HTMLImageElement | null };

export type ReelControls = {
  skip: () => void;
  kill: () => void;
  /** Development only: park the playhead on one frame. */
  freeze: (t: number) => void;
};

/** The beat sheet, in seconds. */
const T = {
  pixel: 0.06,
  snap: 0.3,
  stretch: 0.4,
  grid: 0.52,
  flood: 0.8,
  card1: 1.08,
  card1Out: 1.42,
  boxes: 1.48,
  reflow: 1.98,
  mosaic: 2.34,
  /* A few frames of the pixelated boxes, still in place, before they burst. */
  burst: 2.41,
  orbit: 2.52,
  card2: 2.44,
  card2Out: 2.745,
  marks: [2.8, 3.1, 3.4],
  name: 3.7,
  resolve: 4.26,
  handoff: 4.32,
  end: 5,
};

const MARK_DUR = 0.13;
const NAME_DUR = 0.32;
const MARKS = [
  ['react', 'React'],
  ['nextdotjs', 'Next.js'],
  ['typescript', 'TypeScript'],
] as const;

const SIGNAL = [1, 138 / 255, 61 / 255] as const;

/* Grid placements as [column, span, row, span], 1-based. Each layout tiles
   its grid completely; B is A after a "breakpoint", so the reflow moves every
   box at once. Order follows lib/projects. */
const WIDE = {
  rows: 6,
  a: [
    [1, 5, 1, 4],
    [6, 4, 1, 2],
    [10, 3, 1, 3],
    [6, 4, 3, 4],
    [1, 3, 5, 2],
    [4, 2, 5, 2],
    [10, 3, 4, 3],
  ],
  b: [
    [8, 5, 1, 4],
    [4, 4, 5, 2],
    [1, 3, 4, 3],
    [4, 4, 1, 4],
    [10, 3, 5, 2],
    [8, 2, 5, 2],
    [1, 3, 1, 3],
  ],
};

const TALL = {
  rows: 8,
  a: [
    [1, 4, 1, 2],
    [1, 2, 3, 2],
    [3, 2, 3, 3],
    [1, 2, 5, 2],
    [3, 2, 6, 2],
    [1, 2, 7, 2],
    [3, 2, 8, 1],
  ],
  b: [
    [1, 4, 7, 2],
    [3, 2, 1, 2],
    [1, 2, 1, 3],
    [3, 2, 3, 2],
    [1, 2, 4, 2],
    [3, 2, 5, 2],
    [1, 2, 6, 1],
  ],
};

type Rect = { x: number; y: number; w: number; h: number };

type Morph = {
  start: number;
  dur: number;
  size: number;
  tx: Float32Array;
  ty: Float32Array;
  live: Uint8Array;
  delay: Float32Array;
  arc: Float32Array;
  flash: Float32Array;
  /** Where surplus particles go: back into orbit, or out of the frame. */
  surplus: 'dust' | 'fade';
};

type Field = {
  count: number;
  tile: number;
  x0: Float32Array;
  y0: Float32Array;
  rgb: Float32Array;
  ex: Float32Array;
  ey: Float32Array;
  radius: Float32Array;
  angle: Float32Array;
  speed: Float32Array;
  lag: Float32Array;
  morphs: Morph[];
  data: Float32Array;
  nameBox: Rect;
  /** Each box's run of tiles, for colouring them from its screenshot. */
  spans: {
    from: number;
    nc: number;
    nr: number;
    aspect: number;
    image: HTMLImageElement | null;
    painted: boolean;
  }[];
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => v * v * (3 - 2 * v);

/** Drift, then run in and stop dead — the same arrival the About stage uses,
    so particles land with one accent across the whole site. */
function shape(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.3) return 0.1 * (t / 0.3) ** 1.6;
  const u = (t - 0.3) / 0.7;
  return 0.1 + 0.9 * (1 - (1 - u) ** 4);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function timecode(t: number) {
  const frames = Math.floor(Math.max(0, t) * 24);
  const s = Math.floor(frames / 24);
  const f = frames % 24;
  return `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

export function createReel(root: HTMLElement, works: ReelWork[], onDone: () => void): ReelControls {
  const stage = root.querySelector<HTMLElement>('.reel-stage')!;
  const html = document.documentElement;
  stage.replaceChildren();

  const W = root.clientWidth;
  const H = root.clientHeight;
  const cx = W / 2;
  const cy = H / 2;

  /* The reel draws on the page's own grid — the lines it grows are the ones
     the site keeps — so the handoff needs no alignment pass. */
  const lines = Array.from(document.querySelectorAll<HTMLElement>('.grid-lines span'))
    .filter((el) => el.offsetParent !== null)
    .map((el) => el.getBoundingClientRect().left);
  const tall = lines.length < 13;
  const cols = lines.length - 1;
  const pad = lines[0];
  const gridW = lines[cols] - pad;

  const nameEl = document.querySelector<HTMLElement>('[data-reel-name]');
  const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reel-in]'));

  const make = <K extends keyof HTMLElementTagNameMap = 'div'>(
    cls: string,
    parent: HTMLElement = stage,
    tag?: K
  ) => {
    const el = document.createElement(tag ?? 'div') as HTMLElementTagNameMap[K];
    el.className = cls;
    parent.appendChild(el);
    return el;
  };
  const place = (el: HTMLElement, r: Rect) =>
    Object.assign(el.style, {
      left: `${r.x}px`,
      top: `${r.y}px`,
      width: `${r.w}px`,
      height: `${r.h}px`,
    });

  /* ---------- the build ---------- */

  const floods = Array.from({ length: cols }, (_, i) => {
    const el = make('reel-flood');
    const x0 = i === 0 ? 0 : lines[i];
    const x1 = i === cols - 1 ? W : lines[i + 1];
    place(el, { x: x0, y: 0, w: x1 - x0 + 1, h: H });
    return el;
  });

  const vlines = lines.map((x) => {
    const el = make('reel-vline');
    el.style.left = `${x}px`;
    return el;
  });

  const pixelSize = tall ? 12 : 14;
  const pixel = make('reel-pixel');
  place(pixel, { x: cx - pixelSize / 2, y: cy - pixelSize / 2, w: pixelSize, h: pixelSize });

  const area = { top: tall ? 64 : 72, bottom: H - (tall ? 84 : 76) };
  const rows = tall ? TALL.rows : WIDE.rows;
  const rowH = (area.bottom - area.top) / rows;
  const gap = tall ? 6 : 10;
  const cell = ([c, span, r, rspan]: number[]): Rect => ({
    x: lines[c - 1] + gap / 2,
    y: area.top + (r - 1) * rowH + gap / 2,
    w: lines[c - 1 + span] - lines[c - 1] - gap,
    h: rspan * rowH - gap,
  });
  const layout = tall ? TALL : WIDE;
  const rectsA = layout.a.map(cell);
  const rectsB = layout.b.map(cell);

  const boxes = works.map((work, i) => {
    const box = make('reel-box');
    place(box, rectsA[i]);
    const fill = make('reel-box-fill', box);
    if (work.image) {
      const img = make('reel-box-img', fill, 'img');
      img.alt = '';
      img.src = work.image.src;
    } else {
      fill.classList.add('is-plate');
      make('reel-box-plate', fill).textContent = work.title;
    }
    const tag = make('reel-box-tag', box);
    tag.textContent = work.title;
    return { box, fill, tag };
  });

  /** A title card that solves its own width so the word spans `length` exactly. */
  const card = (word: string, length: number, maxSize: number) => {
    const el = make('reel-card');
    const line = make('reel-card-line', el);
    const letters = Array.from(word, (ch) => {
      const s = make('reel-ch', line, 'span');
      s.textContent = ch;
      return s;
    });
    line.style.fontSize = '100px';
    const at = (wd: number) => {
      line.style.setProperty('--wd', String(wd));
      return line.getBoundingClientRect().width / 100;
    };
    const a50 = at(50);
    const a100 = at(100);
    const a200 = at(200);
    const em = (wd: number) =>
      wd <= 100 ? a50 + ((a100 - a50) * (wd - 50)) / 50 : a100 + ((a200 - a100) * (wd - 100)) / 100;
    let size = length / em(64);
    if (size > maxSize) size = maxSize;
    const ems = length / size;
    const fit =
      ems <= a100
        ? 50 + ((ems - a50) / (a100 - a50)) * 50
        : 100 + ((ems - a100) / (a200 - a100)) * 100;
    const wd = Math.min(200, Math.max(50, fit));
    line.style.fontSize = `${size}px`;
    line.style.setProperty('--wd', String(wd));
    return { el, letters, fit: wd };
  };

  const cardLength = tall ? H - pad * 2 : gridW;
  const cardMax = tall ? W * 0.62 : H * 0.42;
  const interfaces = card('Interfaces', cardLength, cardMax);
  const systems = card('Systems', cardLength, cardMax);
  for (const c of [interfaces, systems]) {
    if (tall) {
      c.el.classList.add('is-turned');
    } else {
      c.el.style.left = `${pad}px`;
    }
  }
  systems.el.classList.add('is-reversed');

  const captions = MARKS.map(([, label]) => {
    const el = make('reel-caption');
    el.textContent = label;
    return el;
  });

  const hud = make('reel-hud');
  hud.textContent = timecode(0);

  /* ---------- particles ---------- */

  // A fresh canvas every run: teardown releases the GPU context, and a canvas
  // whose context was lost cannot hand out another one for a replay.
  const layer: PointLayer = createPointLayer(make('reel-canvas', stage, 'canvas'));
  layer.resize(W, H);

  const markSide = tall ? W * 0.62 : Math.min(W, H) * 0.44;
  const markTop = cy - markSide / 2 - (tall ? 24 : 18);
  captions.forEach((el) => {
    el.style.top = `${markTop + markSide + (tall ? 22 : 26)}px`;
  });

  const build = (): Field => {
    const rand = mulberry32(0x4b4e4f45);
    const tile = tall ? 11 : 17;
    const xs: number[] = [];
    const ys: number[] = [];
    const rgb: number[] = [];
    const spans: Field['spans'] = [];

    works.forEach((work, i) => {
      const r = rectsB[i];
      const nc = Math.max(1, Math.floor(r.w / tile));
      const nr = Math.max(1, Math.floor(r.h / tile));
      const ox = r.x + (r.w - nc * tile) / 2;
      const oy = r.y + (r.h - nr * tile) / 2;
      spans.push({ from: xs.length, nc, nr, aspect: r.w / r.h, image: work.image, painted: false });
      for (let y = 0; y < nr; y++) {
        for (let x = 0; x < nc; x++) {
          xs.push(ox + (x + 0.5) * tile);
          ys.push(oy + (y + 0.5) * tile);
          // The plate — and any screenshot still in flight — is night with a
          // scatter of lit cells, which is roughly what it shows on screen.
          const lit = rand() < 0.16;
          rgb.push(lit ? 1 : 0.03, lit ? 1 : 0.024, lit ? 1 : 0.12);
        }
      }
    });

    const count = xs.length;
    const f = {
      count,
      tile,
      x0: Float32Array.from(xs),
      y0: Float32Array.from(ys),
      rgb: Float32Array.from(rgb),
      ex: new Float32Array(count),
      ey: new Float32Array(count),
      radius: new Float32Array(count),
      angle: new Float32Array(count),
      speed: new Float32Array(count),
      lag: new Float32Array(count),
      morphs: [] as Morph[],
      data: new Float32Array(count * STRIDE),
      nameBox: { x: 0, y: 0, w: W, h: H },
      spans,
    };
    paintTiles(f);

    const reach = Math.max(W, H);
    const ring = Math.min(W, H);
    for (let i = 0; i < count; i++) {
      const dx = f.x0[i] - cx;
      const dy = f.y0[i] - cy;
      const d = Math.hypot(dx, dy) || 1;
      const push = reach * (0.12 + rand() * 0.34);
      f.ex[i] = (dx / d) * push + (rand() - 0.5) * 60;
      f.ey[i] = (dy / d) * push + (rand() - 0.5) * 60;
      f.radius[i] = ring * (0.14 + rand() ** 0.8 * 0.42);
      f.angle[i] = Math.atan2(dy, dx) + (rand() - 0.5) * 0.6;
      // Inner orbits run faster, so the swirl reads as a vortex, not a disc.
      f.speed[i] = 3.4 * Math.sqrt((ring * 0.3) / f.radius[i]);
      f.lag[i] = rand() * 0.1;
    }

    /* Marks, assigned in angular order so the swirl spirals into each shape
       instead of crossing itself. Live particles are spread evenly through
       that order, which spreads the leftover dust evenly around the ring. */
    const order = Array.from({ length: count }, (_, i) => i).sort(
      (a, b) =>
        ((f.angle[a] + f.speed[a] * (T.marks[0] - T.orbit)) % (Math.PI * 2)) -
        ((f.angle[b] + f.speed[b] * (T.marks[0] - T.orbit)) % (Math.PI * 2))
    );
    const GRID = 46;
    const markCell = markSide / GRID;
    const left = cx - markSide / 2;

    MARKS.forEach(([slug], k) => {
      const cells = cellsOf(
        GRID,
        GRID,
        (ctx) => {
          const s = GRID / 24;
          ctx.setTransform(s, 0, 0, s, 0, 0);
          ctx.fill(new Path2D(MARK_PATHS[slug]));
        },
        Math.floor(count * 0.92)
      );
      const n = cells.length / 2;
      const byAngle = Array.from({ length: n }, (_, j) => j).sort((a, b) => {
        const aa = Math.atan2(cells[a * 2 + 1] - GRID / 2, cells[a * 2] - GRID / 2);
        const bb = Math.atan2(cells[b * 2 + 1] - GRID / 2, cells[b * 2] - GRID / 2);
        return aa - bb;
      });
      const m = morph(count, T.marks[k], MARK_DUR, markCell * 0.9, 'dust');
      let next = 0;
      for (let j = 0; j < count && next < n; j++) {
        if (Math.floor(((j + 1) * n) / count) <= next) continue;
        const p = order[j];
        const c = byAngle[next++];
        m.live[p] = 1;
        m.tx[p] = left + (cells[c * 2] + 0.5) * markCell;
        m.ty[p] = markTop + (cells[c * 2 + 1] + 0.5) * markCell;
      }
      for (let p = 0; p < count; p++) {
        m.delay[p] = (m.ty[p] / H) * 0.025 + rand() * 0.02;
        m.arc[p] = (rand() * 2 - 1) * markCell * 4;
        m.flash[p] = rand() < 0.5 ? 1 : 0.25;
      }
      f.morphs.push(m);
    });

    /* The name: rasterised where the hero sets it, at whatever cell size lets
       the field cover it, and filled left to right. */
    const target = nameTargets(count);
    if (target) {
      f.nameBox = target.box;
      const m = morph(count, T.name, NAME_DUR, target.cell * 0.94, 'fade');
      const at = new Float32Array(count);
      const probe = new Float32Array(STRIDE);
      for (let p = 0; p < count; p++) {
        position(f, p, T.name, probe);
        at[p] = probe[0];
      }
      const byX = Array.from({ length: count }, (_, i) => i).sort((a, b) => at[a] - at[b]);
      const n = target.cells.length / 2;
      const cellsByX = Array.from({ length: n }, (_, j) => j).sort(
        (a, b) => target.cells[a * 2] - target.cells[b * 2]
      );
      let next = 0;
      for (let j = 0; j < count && next < n; j++) {
        if (Math.floor(((j + 1) * n) / count) <= next) continue;
        const p = byX[j];
        const c = cellsByX[next++];
        m.live[p] = 1;
        m.tx[p] = target.box.x + (target.cells[c * 2] + 0.5) * target.cell;
        m.ty[p] = target.box.y + (target.cells[c * 2 + 1] + 0.5) * target.cell;
      }
      for (let p = 0; p < count; p++) {
        const along = m.live[p] ? (m.tx[p] - target.box.x) / target.box.w : rand();
        m.delay[p] = along * 0.17 + rand() * 0.05;
        m.arc[p] = (rand() * 2 - 1) * target.cell * 10;
        m.flash[p] = rand() < 0.4 ? 1 : 0.2;
      }
      f.morphs.push(m);
    }
    return f;
  };

  const morph = (
    count: number,
    start: number,
    dur: number,
    size: number,
    surplus: Morph['surplus']
  ): Morph => ({
    start,
    dur,
    size,
    surplus,
    tx: new Float32Array(count),
    ty: new Float32Array(count),
    live: new Uint8Array(count),
    delay: new Float32Array(count),
    arc: new Float32Array(count),
    flash: new Float32Array(count),
  });

  /** The hero's name as lattice cells, rasterised over its live letter boxes. */
  const nameTargets = (count: number) => {
    if (!nameEl) return null;
    const words = Array.from(nameEl.querySelectorAll<HTMLElement>('[data-reel-word]'));
    const parts = words
      .map((word) => {
        const letters = word.querySelectorAll<HTMLElement>('.ch');
        if (!letters.length) return null;
        const first = letters[0].getBoundingClientRect();
        const last = letters[letters.length - 1].getBoundingClientRect();
        const cs = getComputedStyle(letters[0]);
        return {
          text: word.textContent ?? '',
          left: first.left,
          right: last.right,
          top: first.top,
          size: parseFloat(cs.fontSize),
          font: cs.fontFamily,
        };
      })
      .filter((p) => p !== null);
    if (!parts.length) return null;

    const probe = document.createElement('canvas').getContext('2d');
    if (!probe) return null;
    const glyphs = parts.map((p) => {
      probe.font = `800 ${p.size}px ${p.font}`;
      const m = probe.measureText(p.text);
      const ascent = m.fontBoundingBoxAscent || p.size * 1.09;
      const capTop = p.top + ascent - (m.actualBoundingBoxAscent || p.size * 0.76);
      return {
        ...p,
        natural: m.width,
        baseline: p.top + ascent,
        capTop,
        descent: m.actualBoundingBoxDescent || 0,
      };
    });
    const box = {
      x: Math.min(...glyphs.map((g) => g.left)),
      y: Math.min(...glyphs.map((g) => g.capTop)) - 2,
      w: 0,
      h: 0,
    };
    box.w = Math.max(...glyphs.map((g) => g.right)) - box.x;
    box.h = Math.max(...glyphs.map((g) => g.baseline + g.descent)) - box.y + 2;

    const paintAt = (unit: number) => (ctx: CanvasRenderingContext2D) => {
      for (const g of glyphs) {
        ctx.font = `800 ${g.size}px ${g.font}`;
        ctx.setTransform(
          (g.right - g.left) / g.natural / unit,
          0,
          0,
          1 / unit,
          (g.left - box.x) / unit,
          (g.baseline - box.y) / unit
        );
        ctx.fillText(g.text, 0, 0);
      }
    };
    const fine = 3;
    const ink =
      coverage(Math.ceil(box.w / fine), Math.ceil(box.h / fine), paintAt(fine)) * box.w * box.h;
    const unit = Math.min(10, Math.max(3, Math.sqrt(ink / count)));
    const cells = cellsOf(Math.ceil(box.w / unit), Math.ceil(box.h / unit), paintAt(unit), count);
    return { box, cell: unit, cells };
  };

  /** One particle at time `t`, written into `out` at `o`. Runs a few thousand
      times a frame, so it allocates nothing. */
  function position(f: Field, i: number, t: number, out: Float32Array, o = 0) {
    let x = f.x0[i];
    let y = f.y0[i];
    let s = f.tile - 1;
    let r = f.rgb[i * 3];
    let g = f.rgb[i * 3 + 1];
    let b = f.rgb[i * 3 + 2];
    let a = 1;
    const dot = tall ? 2.5 : 3;
    const spin = f.angle[i] + f.speed[i] * (t - T.orbit);
    const cos = Math.cos(spin);
    const sin = Math.sin(spin);

    if (t > T.burst) {
      const u = clamp01((t - T.burst) / 0.42);
      const e = 1 - (1 - u) ** 4;
      x += f.ex[i] * e;
      y += f.ey[i] * e;
      s += (dot - s) * clamp01(u * 1.8);
    }

    if (t > T.orbit) {
      const e = smooth(clamp01((t - T.orbit - f.lag[i]) / 0.36));
      x += (cx + cos * f.radius[i] - x) * e;
      y += (cy + sin * f.radius[i] * 0.86 - y) * e;
      const k = e * 0.6;
      r += (1 - r) * k;
      g += (1 - g) * k;
      b += (1 - b) * k;
    }

    for (const m of f.morphs) {
      if (t <= m.start) break;
      const u = clamp01((t - m.start - m.delay[i]) / m.dur);
      if (u <= 0) continue;
      const e = shape(u);
      if (m.live[i]) {
        const dx = m.tx[i] - x;
        const dy = m.ty[i] - y;
        const len = Math.hypot(dx, dy) || 1;
        const arc = Math.sin(Math.PI * u) * m.arc[i];
        x += dx * e + (-dy / len) * arc;
        y += dy * e + (dx / len) * arc;
        s += (m.size - s) * e;
        r += (1 - r) * e;
        g += (1 - g) * e;
        b += (1 - b) * e;
        a += (1 - a) * e;
        const flash = Math.sin(Math.PI * u) ** 1.4 * m.flash[i] * 0.9;
        r += (SIGNAL[0] - r) * flash;
        g += (SIGNAL[1] - g) * flash;
        b += (SIGNAL[2] - b) * flash;
      } else if (m.surplus === 'dust') {
        const radius = f.radius[i] * 1.25 + markSide * 0.18;
        x += (cx + cos * radius - x) * e;
        y += (cy + sin * radius * 0.86 - y) * e;
        s += (2 - s) * e;
        a += (0.32 - a) * e;
        r += (1 - r) * e;
        g += (1 - g) * e;
        b += (1 - b) * e;
      } else {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy) || 1;
        x += (dx / d) * W * 0.25 * e;
        y += (dy / d) * W * 0.25 * e;
        a *= 1 - e;
      }
    }

    if (t > T.resolve) {
      const along = (x - f.nameBox.x) / f.nameBox.w;
      const u = clamp01((t - T.resolve - clamp01(along) * 0.1) / 0.16);
      s *= 1 - u;
      a *= 1 - u * u;
    }

    out[o] = x;
    out[o + 1] = y;
    out[o + 2] = s;
    out[o + 3] = r;
    out[o + 4] = g;
    out[o + 5] = b;
    out[o + 6] = a;
  }

  const arrived = (image: HTMLImageElement | null) => !!image?.complete && image.naturalWidth > 0;

  /** Colours each box's tiles from its screenshot, where one has arrived. Run
      at build, and again as each late screenshot lands — never on the cut. */
  function paintTiles(f: Field) {
    for (const span of f.spans) {
      const { from, nc, nr, aspect, image } = span;
      if (span.painted || !arrived(image)) continue;
      const tiles = tilesOf(image!, aspect, nc, nr);
      span.painted = true;
      if (!tiles) continue;
      for (let j = 0; j < nc * nr; j++) {
        f.rgb[(from + j) * 3] = tiles[j * 4] / 255;
        f.rgb[(from + j) * 3 + 1] = tiles[j * 4 + 1] / 255;
        f.rgb[(from + j) * 3 + 2] = tiles[j * 4 + 2] / 255;
      }
    }
  }

  // Everything the cut needs is done here, under the reel's opening black:
  // rasterising and sorting a few thousand particles, and one throwaway draw
  // so the GPU compiles its program now rather than on the cut itself.
  const field = build();
  const late = field.spans
    .map((span) => span.image)
    .filter((image): image is HTMLImageElement => !!image && !arrived(image));
  const onArrive = () => paintTiles(field);
  for (const image of late) image.addEventListener('load', onArrive);
  for (let i = 0; i < field.count; i++) position(field, i, T.mosaic, field.data, i * STRIDE);
  layer.draw(field.data, field.count);
  layer.draw(field.data, 0);

  const render = (t: number) => {
    hud.textContent = timecode(t);
    html.style.setProperty('--reel-progress', String(clamp01(t / T.end)));
    if (t < T.mosaic) {
      layer.draw(field.data, 0);
      return;
    }
    for (let i = 0; i < field.count; i++) position(field, i, t, field.data, i * STRIDE);
    layer.draw(field.data, field.count);
  };

  /* ---------- the timeline ---------- */

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  const clock = { t: 0 };
  tl.to(clock, { t: T.end, duration: T.end, ease: 'none', onUpdate: () => render(clock.t) }, 0);

  // 1. The pixel arrives tilted, as it sits in the page's margins, and snaps square.
  tl.fromTo(
    pixel,
    { scale: 0, rotation: 14 },
    { scale: 1, duration: 0.26, ease: 'back.out(3)' },
    T.pixel
  )
    .to(pixel, { rotation: 0, duration: 0.14, ease: 'power3.inOut' }, T.snap)
    .to(
      pixel,
      { scaleX: (W + 40) / pixelSize, scaleY: 2 / pixelSize, duration: 0.24, ease: 'expo.inOut' },
      T.stretch
    )
    .to(pixel, { opacity: 0, duration: 0.18, ease: 'power1.in' }, T.grid + 0.1);

  // 2. Columns grow out of the line, then the ground floods in column by column.
  tl.fromTo(
    vlines,
    { scaleY: 0, transformOrigin: `50% ${cy}px` },
    { scaleY: 1, duration: 0.42, stagger: { each: tall ? 0.05 : 0.022, from: 'center' } },
    T.grid
  );
  floods.forEach((el, i) => {
    tl.fromTo(
      el,
      { scaleY: 0, transformOrigin: i % 2 ? '50% 100%' : '50% 0%' },
      { scaleY: 1, duration: 0.36, ease: 'expo.inOut' },
      T.flood + i * (tall ? 0.05 : 0.018)
    );
  });

  // 3. "Interfaces": far too wide, then compressed onto the grid's edges.
  tl.fromTo(
    interfaces.letters,
    { '--wd': 200, yPercent: 110 },
    { '--wd': interfaces.fit, yPercent: 0, duration: 0.36, stagger: 0.018 },
    T.card1
  ).to(
    interfaces.letters,
    { yPercent: -110, duration: 0.16, ease: 'expo.in', stagger: 0.008 },
    T.card1Out
  );

  // 4. The work: each box snaps out from its corner and its screenshot wipes in.
  boxes.forEach(({ box, fill, tag }, i) => {
    const at = T.boxes + i * 0.05;
    const r = rectsA[i];
    // A zero-size box would still draw its outline as a dot.
    tl.set(box, { visibility: 'visible' }, at)
      .fromTo(
        box,
        { width: 0, height: 0 },
        { width: r.w, height: r.h, duration: 0.3, ease: 'expo.out' },
        at
      )
      .fromTo(
        fill,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.3, ease: 'expo.inOut' },
        at + 0.06
      )
      .fromTo(tag, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, at + 0.14);
  });

  // 5. A breakpoint: every box reflows to a new layout at once.
  boxes.forEach(({ box }, i) => {
    const r = rectsB[i];
    tl.to(
      box,
      { left: r.x, top: r.y, width: r.w, height: r.h, duration: 0.34, ease: 'expo.inOut' },
      T.reflow + i * 0.012
    );
  });

  // 6. Pixelate on the cut: the boxes hand over to the field, tile for tile.
  tl.set(
    boxes.map((b) => b.box),
    { opacity: 0 },
    T.mosaic
  ).to(vlines, { opacity: 0.45, duration: 0.2, ease: 'none' }, T.mosaic);

  // 7. "Systems": the opposite move — grown from narrow while the field swirls.
  // The last letter in must land before the first letter out leaves: an
  // entrance still running past its exit would set the letter back in place.
  tl.fromTo(
    systems.letters,
    { '--wd': 50, scaleY: 0 },
    { '--wd': systems.fit, scaleY: 1, duration: 0.26, stagger: { each: 0.014, from: 'center' } },
    T.card2
  ).to(
    systems.letters,
    { scaleY: 0, duration: 0.12, ease: 'expo.in', stagger: { each: 0.008, from: 'edges' } },
    T.card2Out
  );

  // 8. The stack, one cut per mark.
  captions.forEach((el, k) => {
    tl.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.14 }, T.marks[k] + 0.1).to(
      el,
      { opacity: 0, duration: 0.06, ease: 'none' },
      (T.marks[k + 1] ?? T.name) + 0.02
    );
  });

  // 9. The name resolves into the page's own type, and the page arrives.
  if (nameEl) tl.to(nameEl, { opacity: 1, duration: 0.2, ease: 'power2.out' }, T.resolve);
  tl.set(root, { backgroundColor: 'transparent' }, T.handoff - 0.02)
    .set(floods, { opacity: 0 }, T.handoff - 0.02)
    .to(vlines, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, T.handoff)
    .to(hud, { opacity: 0, duration: 0.3, ease: 'none' }, T.handoff);
  reveals.forEach((el, i) => {
    tl.fromTo(
      el,
      { opacity: 1, clipPath: 'inset(-20% 100% -20% 0)' },
      { clipPath: 'inset(-20% 0% -20% 0)', duration: 0.5, ease: 'expo.inOut' },
      T.handoff + i * 0.06
    );
  });

  /* ---------- lifecycle ---------- */

  let finished = false;
  const teardown = () => {
    tl.kill();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('wheel', onSkipGesture);
    window.removeEventListener('touchmove', onSkipGesture);
    root.removeEventListener('pointerdown', onSkipGesture);
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('resize', onResize);
    for (const image of late) image.removeEventListener('load', onArrive);
    layer.draw(new Float32Array(0), 0);
    layer.destroy();
    stage.replaceChildren();
    gsap.set(root, { clearProps: 'backgroundColor' });
    gsap.set([...reveals, ...(nameEl ? [nameEl] : [])], { clearProps: 'opacity,clipPath' });
    html.style.removeProperty('--reel-progress');
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    teardown();
    onDone();
  };
  tl.eventCallback('onComplete', finish);

  const skip = () => {
    if (finished) return;
    if (tl.time() < T.handoff - 0.08) {
      tl.seek(T.handoff - 0.08, false);
      render(tl.time());
    }
    tl.timeScale(1.6).play();
  };

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') skip();
  }
  function onSkipGesture(e: Event) {
    if (e.target instanceof Element && e.target.closest('.reel-skip')) return;
    skip();
  }
  function onFocus(e: FocusEvent) {
    if (e.target instanceof Element && !e.target.closest('.reel-skip')) skip();
  }
  function onResize() {
    if (root.clientWidth !== W) skip();
  }

  window.addEventListener('keydown', onKey);
  window.addEventListener('wheel', onSkipGesture, { passive: true });
  window.addEventListener('touchmove', onSkipGesture, { passive: true });
  root.addEventListener('pointerdown', onSkipGesture);
  document.addEventListener('focusin', onFocus);
  window.addEventListener('resize', onResize);

  render(0);
  tl.play(0);

  return {
    skip,
    kill: () => {
      if (finished) return;
      finished = true;
      teardown();
    },
    freeze: (t: number) => {
      tl.pause();
      tl.seek(t, false);
      render(t);
    },
  };
}
