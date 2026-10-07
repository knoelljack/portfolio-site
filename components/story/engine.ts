import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPacer, type Pacer } from './pacer';

gsap.registerPlugin(ScrollTrigger);

/**
 * The page after the reel: one scrubbed timeline over a sticky stage, told
 * in screens of scroll, with the page paced from one beat's rest to the next.
 *
 *   name → the pixel at the end of the lede grows into a field while the name
 *   rises away and "Interfaces" squeezes in across it (the reel's own card
 *   move) → the field reflows into each of seven posters in turn, mirrored
 *   every time — the reel's breakpoint — while the card snaps out of its
 *   corner and each screenshot wipes over the last → the field folds into the
 *   base of a tower, the rest of the stack drops onto it and "Systems" grows
 *   in → the contact cover rises in columns, the reel's flood.
 *
 * Every exit is the next beat's entrance: the field is never hidden between
 * beats, it only changes shape and colour. The pacer moves the page between
 * the beats' rests, one input at a time.
 */

export type StoryControls = { kill: () => void };

/** Rests, in screens. Poster k rests at `posterAt(k)`; the fold into the
    tower takes a longer move than a reflow. */
const WORK = 1;
const FIRST = 2;
const FOLD = 1.2;
const posterAt = (k: number) => FIRST + k;

/** How far a letter travels to be out of sight: past its own line box and
    the descender room under it, which the mask keeps. */
const HIDE = 145;

const SHOWN = 'inset(0% 0% 0% 0%)';
const FOLDED = 'inset(0% 100% 100% 0%)';
/** A screenshot waits clipped to nothing on the side it will wipe in from. */
const FROM_LEFT = 'inset(0% 100% 0% 0%)';
const FROM_RIGHT = 'inset(0% 0% 0% 100%)';

type Rect = { x: number; y: number; w: number; h: number };

export function createStory(track: HTMLElement, pacing = true): StoryControls {
  const html = document.documentElement;
  const one = <T extends Element = HTMLElement>(sel: string, root: ParentNode = track) =>
    root.querySelector<T>(sel)!;
  const all = <T extends Element = HTMLElement>(sel: string, root: ParentNode = track) =>
    Array.from(root.querySelectorAll<T>(sel));

  const len = parseFloat(getComputedStyle(track).getPropertyValue('--story-len')) || 10.2;
  const stage = one('.stage');

  const nameBeat = one('.beat-name');
  const role = one('.name-role');
  const lede = one('.lede');
  const pixel = one('.lede .pixel');
  const cue = one('.name-cue');
  const nameWords = all('.name-word');

  const ifSlot = one('.interfaces-field');
  const ifChars = all('.interfaces-word .ch');
  const ifLead = all('.interfaces-lead > span');

  const parts = all('.poster').map((el) => ({
    el,
    slot: one('.poster-field', el),
    cardSlot: one('.poster-card', el),
    chars: all('.poster-title .ch', el),
    rest: [one('.poster-meta', el), one('.poster-summary', el), one('.poster-link', el)],
    color: getComputedStyle(el).getPropertyValue('--c').trim(),
  }));
  const LAST = parts.length - 1;
  const SYSTEMS = posterAt(LAST) + FOLD;

  const field = one('.s-field');
  const card = one('.s-card');
  const cardTilt = one('.s-card-tilt');
  const cardInner = one('.s-card-inner');
  const layers = all('.s-layer');
  const progress = one('.s-progress');
  const squares = all<HTMLButtonElement>('.s-sq');
  const marker = one('.s-marker');

  const systems = one('.beat-systems');
  const sysChars = all('.systems-word .ch');
  const sysText = [one('.systems-lead'), one('.systems-rest')];
  const bars = all('.bar');
  const base = bars[bars.length - 1];
  const upper = bars.slice(0, -1).reverse();

  const coverChars = Array.from(document.querySelectorAll<HTMLElement>('.cover-word .ch'));
  const orange = getComputedStyle(html).getPropertyValue('--orange').trim();

  /** The width each fitted letter is solved to: its line's. */
  const fitOf = (_: number, el: Element) =>
    parseFloat(getComputedStyle(el.parentElement!).getPropertyValue('--wd')) || 100;

  // Everything the timeline writes to, and exactly which properties, so a
  // rebuild or a teardown clears only what it set — the server-rendered
  // custom properties on lines, posters and blocks have to survive it.
  const MOVED = 'transform,opacity,visibility,pointerEvents';
  const resets: [gsap.TweenTarget, string][] = [
    [[nameBeat, role, lede, pixel, cue, ...nameWords, ...ifLead], MOVED],
    [[...ifChars, ...sysChars, ...coverChars], `${MOVED},--wd,transformOrigin`],
    [parts.flatMap((p) => [p.el, ...p.rest]), MOVED],
    [parts.flatMap((p) => p.chars), `${MOVED},--wd`],
    [[systems, ...sysText, ...bars, progress, marker], MOVED],
    [[field, card], `${MOVED},width,height,backgroundColor`],
    [[cardInner, ...layers], 'clipPath'],
  ];

  let tl: gsap.core.Timeline | null = null;
  let st: ScrollTrigger | null = null;
  let columns: HTMLElement[] = [];

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const svh = () => probe.offsetHeight || window.innerHeight;

  const build = () => {
    const sr = stage.getBoundingClientRect();
    const rect = (el: Element): Rect => {
      const r = el.getBoundingClientRect();
      return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
    };
    // The field is one screen-sized box moved and scaled from its corner, so
    // every change of shape stays on the compositor.
    const W = field.offsetWidth || 1;
    const H = field.offsetHeight || 1;
    const shape = (r: Rect) => ({ x: r.x, y: r.y, scaleX: r.w / W, scaleY: r.h / H });

    const pixelAt = rect(pixel);
    const ifAt = rect(ifSlot);
    const fieldAt = parts.map((p) => rect(p.slot));
    const cardAt = parts.map((p) => rect(p.cardSlot));
    const baseAt = rect(base);
    const dropY = upper.map((el) => {
      const r = rect(el);
      return -(r.y + r.h + 40);
    });
    const pitch = squares.length > 1 ? squares[1].offsetLeft - squares[0].offsetLeft : 0;
    columns = Array.from(document.querySelectorAll<HTMLElement>('.cover-col')).filter(
      (c) => c.offsetParent !== null
    );

    /* ---------- where everything starts ---------- */

    gsap.set(field, { ...shape(pixelAt), autoAlpha: 0, backgroundColor: orange });
    gsap.set(card, {
      width: cardAt[0].w,
      height: cardAt[0].h,
      x: cardAt[0].x,
      y: cardAt[0].y,
      autoAlpha: 0,
    });
    gsap.set(cardInner, { clipPath: FOLDED });
    // Each screenshot waits on the side the field is leaving.
    layers.forEach((l, i) => gsap.set(l, { clipPath: i === 0 || i % 2 ? FROM_LEFT : FROM_RIGHT }));
    gsap.set(progress, { autoAlpha: 0 });
    // A staggered tween applies its starting state to each target only when
    // that target's own turn comes, so every starting state is set here.
    gsap.set(ifChars, { yPercent: HIDE, '--wd': 200 });
    gsap.set(ifLead, { opacity: 0, y: 20 });
    for (const p of parts) {
      gsap.set(p.el, { pointerEvents: 'none' });
      gsap.set(p.chars, { yPercent: HIDE, '--wd': 50 });
      gsap.set(p.rest, { opacity: 0, y: 16 });
    }
    gsap.set(systems, { pointerEvents: 'none' });
    gsap.set(sysChars, { '--wd': 50, scaleY: 0, transformOrigin: '50% 70%' });
    gsap.set(sysText, { opacity: 0, y: 18 });
    gsap.set(bars, { opacity: 0 });
    // A wave from the left: each column of the cover lags the one before.
    columns.forEach((c, i) =>
      gsap.set(c, { yPercent: 8 + (42 * i) / Math.max(1, columns.length - 1) })
    );
    gsap.set(coverChars, { yPercent: HIDE, '--wd': 50 });

    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: () => lean() });
    tl.set({}, {}, len);

    /* ---------- name → interfaces: the pixel becomes the field ---------- */

    tl.set(field, { autoAlpha: 1 }, 0.001).set(pixel, { opacity: 0 }, 0.001);
    // The name's parts are revealed by the reel, so nothing here may touch
    // them before the reader scrolls: explicit from-values, rendered only once
    // the playhead reaches them.
    tl.fromTo(
      [role, lede, cue],
      { y: 0, opacity: 1 },
      {
        y: -28,
        opacity: 0,
        duration: 0.28,
        stagger: 0.04,
        ease: 'power2.in',
        immediateRender: false,
      },
      0.02
    );
    tl.fromTo(
      nameWords,
      { yPercent: 0 },
      { yPercent: -112, duration: 0.32, stagger: 0.07, ease: 'power3.in', immediateRender: false },
      0.06
    );
    tl.set(nameBeat, { pointerEvents: 'none' }, 0.3);
    tl.fromTo(
      field,
      shape(pixelAt),
      { ...shape(ifAt), duration: 0.62, ease: 'expo.inOut', immediateRender: false },
      0.1
    );
    tl.to(
      ifChars,
      { yPercent: 0, '--wd': fitOf, duration: 0.36, stagger: 0.016, ease: 'expo.out' },
      0.46
    );
    tl.to(ifLead, { opacity: 1, y: 0, duration: 0.24, stagger: 0.06, ease: 'power2.out' }, 0.68);

    /* ---------- interfaces → the first poster ---------- */

    tl.to(
      ifChars,
      { yPercent: -HIDE, duration: 0.2, stagger: 0.008, ease: 'expo.in' },
      WORK + 0.02
    );
    tl.to(ifLead, { opacity: 0, y: -16, duration: 0.14 }, WORK + 0.02);
    move(fieldAt[0], parts[0].color, WORK + 0.08);
    // The card snaps out of its corner, as the reel's boxes do, and its
    // screenshot wipes in after it.
    tl.set(card, { autoAlpha: 1 }, WORK + 0.34);
    tl.to(cardInner, { clipPath: SHOWN, duration: 0.3, ease: 'expo.out' }, WORK + 0.34);
    tl.to(layers[0], { clipPath: SHOWN, duration: 0.32, ease: 'expo.inOut' }, WORK + 0.44);
    enter(0, WORK + 0.56);
    tl.to(progress, { autoAlpha: 1, duration: 0.2 }, WORK + 0.6);

    /* ---------- poster to poster: the breakpoint ---------- */

    for (let k = 0; k < LAST; k++) {
      const t = posterAt(k);
      leave(k, t + 0.02);
      move(fieldAt[k + 1], parts[k + 1].color, t + 0.08);
      tl.to(
        card,
        { x: cardAt[k + 1].x, y: cardAt[k + 1].y, duration: 0.62, ease: 'expo.inOut' },
        t + 0.08
      );
      tl.to(layers[k + 1], { clipPath: SHOWN, duration: 0.34, ease: 'expo.inOut' }, t + 0.3);
      tl.to(marker, { x: (k + 1) * pitch, duration: 0.4, ease: 'power2.inOut' }, t + 0.12);
      enter(k + 1, t + 0.56);
    }

    /* ---------- the last poster → the stack ---------- */

    const fold = posterAt(LAST);
    leave(LAST, fold + 0.02);
    tl.to(progress, { autoAlpha: 0, duration: 0.16 }, fold + 0.04);
    tl.to(cardInner, { clipPath: FOLDED, duration: 0.22, ease: 'expo.in' }, fold + 0.08);
    tl.set(card, { autoAlpha: 0 }, fold + 0.3);
    move(baseAt, getComputedStyle(base).getPropertyValue('--c').trim(), fold + 0.14, 0.56);
    tl.set(systems, { pointerEvents: 'auto' }, fold + 0.5);
    // The field lands exactly on the foundation block and hands over to it.
    tl.set(base, { opacity: 1 }, fold + 0.7).set(field, { autoAlpha: 0 }, fold + 0.7);
    tl.fromTo(
      upper,
      { opacity: 1, y: (i: number) => dropY[i] },
      { y: 0, duration: 0.3, stagger: 0.06, ease: 'expo.out', immediateRender: false },
      fold + 0.6
    );
    tl.to(
      sysChars,
      {
        '--wd': fitOf,
        scaleY: 1,
        duration: 0.32,
        stagger: { each: 0.014, from: 'center' },
        ease: 'expo.out',
      },
      fold + 0.5
    );
    tl.to(
      sysText,
      { opacity: 1, y: 0, duration: 0.24, stagger: 0.06, ease: 'power2.out' },
      fold + 0.8
    );

    /* ---------- the stack → contact: the cover floods up ---------- */

    // Everything ends by `len`: a tween running past it would stretch the
    // timeline, and every rest, anchor and paced move would land a little late.
    tl.to(columns, { yPercent: 0, duration: len - SYSTEMS }, SYSTEMS);
    tl.to(
      coverChars,
      { yPercent: 0, '--wd': fitOf, duration: 0.22, stagger: 0.008, ease: 'expo.out' },
      len - 0.4
    );

    tl.addLabel('name', 0).addLabel('work', WORK);
    parts.forEach((_, k) => tl!.addLabel(`p${k}`, posterAt(k)));
    tl.addLabel('about', SYSTEMS).addLabel('end', len);

    st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      // The stage is stuck for exactly `len` small-viewport heights; measuring
      // that, rather than "bottom bottom", keeps the timeline's end on the
      // stage's release whatever the address bar is doing.
      end: () => `+=${len * svh()}`,
      animation: tl,
      // The pacer already eases every move, so the timeline follows the scroll
      // exactly rather than smoothing it a second time.
      scrub: true,
      // No invalidateOnRefresh: it reverts the timeline on every refresh —
      // including the one on window load — which wipes the starting states
      // set above. Layout-dependent values are rebuilt on resize instead.
    });

    /** The field reflows to `to` and takes `color` at the fastest point of
        the move — a cut, as the reel cuts — rather than crossfading through
        the colours between. */
    function move(to: Rect, color: string, t: number, duration = 0.62) {
      tl!.to(field, { ...shape(to), duration, ease: 'expo.inOut' }, t);
      tl!.to(field, { backgroundColor: color, duration: 0.04 }, t + duration / 2 - 0.02);
    }

    function enter(k: number, t: number) {
      const p = parts[k];
      tl!.set(p.el, { pointerEvents: 'auto' }, t);
      tl!.to(
        p.chars,
        { yPercent: 0, '--wd': fitOf, duration: 0.3, stagger: 0.012, ease: 'expo.out' },
        t
      );
      tl!.to(
        p.rest,
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out' },
        t + 0.08
      );
    }

    function leave(k: number, t: number) {
      const p = parts[k];
      tl!.to(
        p.chars,
        { yPercent: -HIDE, '--wd': 50, duration: 0.18, stagger: 0.006, ease: 'power2.in' },
        t
      );
      tl!.to(p.rest, { opacity: 0, y: -12, duration: 0.12, stagger: 0.02 }, t);
      tl!.set(p.el, { pointerEvents: 'none' }, t + 0.18);
    }
  };

  const teardownTimeline = () => {
    st?.kill();
    tl?.kill();
    st = null;
    tl = null;
    for (const [targets, props] of resets) gsap.set(targets, { clearProps: props });
    gsap.set(columns, { clearProps: 'transform' });
    cardTilt.style.removeProperty('--rx');
    cardTilt.style.removeProperty('--ry');
  };

  /* ---------- getting around: deep links, the menu, focus ---------- */

  const yFor = (t: number) => (st ? st.start + (t / len) * (st.end - st.start) : 0);

  let pacer: Pacer | null = null;

  /** A jump lands at once: any paced move in flight is dropped, not finished. */
  const settle = () => {
    pacer?.stop();
    ScrollTrigger.update();
  };

  const jumpTo = (t: number) => {
    pacer?.stop();
    window.scrollTo({ top: yFor(t), behavior: 'instant' });
    ScrollTrigger.update();
  };

  // The beats' ids move from their layers on the stage to anchors in the
  // scroll track, each where its beat is at rest. A fragment — a menu link, a
  // typed hash, back and forward — is then the browser's own scroll to the
  // right place.
  const anchors = (
    [
      ['top', 0],
      ['work', WORK],
      ['about', SYSTEMS],
    ] as const
  ).map(([id, t]) => {
    const layer = document.getElementById(id);
    const anchor = document.createElement('span');
    anchor.className = 'story-anchor';
    anchor.style.top = `calc(${t} * 100svh)`;
    layer?.removeAttribute('id');
    anchor.id = id;
    track.appendChild(anchor);
    return { id, layer, anchor };
  });

  // A progress square is a long jump, made under the cover rather than
  // fast-forwarding through the posters between.
  const onClick = (e: MouseEvent) => {
    const sq = e.target instanceof Element ? e.target.closest<HTMLElement>('.s-sq') : null;
    if (!sq || !st) return;
    const t = posterAt(Number(sq.dataset.sq));
    if (pacer) pacer.cut(yFor(t));
    else jumpTo(t);
  };

  // A keyboard reader tabbing to a project that is not on stage is carried to
  // it, so focus never lands on something the stage is hiding.
  const onFocus = (e: FocusEvent) => {
    if (!tl || !(e.target instanceof Element) || !track.contains(e.target)) return;
    const poster = e.target.closest<HTMLElement>('.poster');
    if (!poster) return;
    const t = posterAt(Number(poster.dataset.i));
    if (Math.abs(tl.time() - t) > 0.05) jumpTo(t);
  };

  /* ---------- the card leans toward the pointer ---------- */

  const tilt = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 };
  const onPosters = () => !!tl && tl.time() > WORK + 0.5 && tl.time() < posterAt(LAST) + 0.1;
  const step = () => {
    tilt.x += (tilt.tx - tilt.x) * 0.12;
    tilt.y += (tilt.ty - tilt.y) * 0.12;
    cardTilt.style.setProperty('--rx', `${tilt.x.toFixed(2)}deg`);
    cardTilt.style.setProperty('--ry', `${tilt.y.toFixed(2)}deg`);
    const settled = Math.abs(tilt.tx - tilt.x) < 0.02 && Math.abs(tilt.ty - tilt.y) < 0.02;
    tilt.raf = settled ? 0 : requestAnimationFrame(step);
  };
  const wake = () => {
    if (!tilt.raf) tilt.raf = requestAnimationFrame(step);
  };
  function lean() {
    if (!onPosters() && (tilt.tx || tilt.ty)) {
      tilt.tx = 0;
      tilt.ty = 0;
      wake();
    }
  }
  const onPointer = (e: PointerEvent) => {
    if (!onPosters()) return;
    if (e.pointerType === 'mouse') {
      tilt.tx = -(e.clientY / window.innerHeight - 0.5) * 8;
      tilt.ty = (e.clientX / window.innerWidth - 0.5) * 12;
    } else if (e.buttons && e.target instanceof Element && e.target.closest('.s-card')) {
      // A finger dragged across the card tilts it; a vertical drag still
      // scrolls, because the card only claims horizontal panning.
      const r = card.getBoundingClientRect();
      tilt.tx = 0;
      tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 18;
    } else return;
    wake();
  };
  const onRelease = () => {
    tilt.tx = 0;
    tilt.ty = 0;
    wake();
  };

  /* ---------- lifecycle ---------- */

  let width = window.innerWidth;
  let small = svh();
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // A phone's address bar coming and going changes the window's height
      // but not `svh`, which every beat is laid out in — so that alone
      // rebuilds nothing. A new width, or a window resized for real, does.
      if (window.innerWidth === width && svh() === small) return;
      width = window.innerWidth;
      small = svh();
      const at = st?.progress ?? 0;
      pacer?.stop();
      teardownTimeline();
      build();
      ScrollTrigger.refresh();
      if (st) {
        window.scrollTo({ top: st.start + at * (st.end - st.start), behavior: 'instant' });
        settle();
      }
    }, 180);
  };

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = () => {
    if (!motion.matches) return;
    kill();
    html.removeAttribute('data-scenes');
  };

  // The stage shows every screenshot in one place, so it wants all of them
  // now rather than whenever lazy loading would have judged them near.
  for (const img of all<HTMLImageElement>('.s-card img')) img.loading = 'eager';

  ScrollTrigger.config({ ignoreMobileResize: true });
  build();
  ScrollTrigger.refresh();

  if (pacing) {
    const cut = all('.s-cut-col');
    pacer = createPacer({
      beats: () =>
        tl && st
          ? Object.values(tl.labels)
              .sort((a, b) => a - b)
              .map(yFor)
          : [0],
      blocked: () =>
        html.hasAttribute('data-intro') || !!document.querySelector('.menu[data-open]'),
      cover: () => cut,
    });
  }

  // A deep link that arrived before the anchors did was scrolled to the
  // beat's layer instead, so it is landed again here — and once more after
  // load, in case the browser repeats its own fragment scroll — unless the
  // reader has started scrolling for themselves.
  const landing = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
  let steered = false;
  const onInput = () => {
    steered = true;
  };
  const land = () => {
    if (steered || !landing) return;
    window.scrollTo({
      top: landing.getBoundingClientRect().top + window.scrollY,
      behavior: 'instant',
    });
    settle();
  };
  land();
  if (landing) {
    window.addEventListener('load', land, { once: true });
    window.setTimeout(land, 400);
    for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
      window.addEventListener(type, onInput, { once: true, passive: true });
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('focusin', onFocus);
  window.addEventListener('story:jump', settle);
  stage.addEventListener('pointermove', onPointer);
  stage.addEventListener('pointerleave', onRelease);
  stage.addEventListener('pointerup', onRelease);
  stage.addEventListener('pointercancel', onRelease);
  window.addEventListener('resize', onResize);
  motion.addEventListener('change', onMotion);

  function kill() {
    window.clearTimeout(resizeTimer);
    cancelAnimationFrame(tilt.raf);
    document.removeEventListener('click', onClick);
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('story:jump', settle);
    stage.removeEventListener('pointermove', onPointer);
    stage.removeEventListener('pointerleave', onRelease);
    stage.removeEventListener('pointerup', onRelease);
    stage.removeEventListener('pointercancel', onRelease);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', land);
    for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
      window.removeEventListener(type, onInput);
    }
    motion.removeEventListener('change', onMotion);
    pacer?.destroy();
    pacer = null;
    teardownTimeline();
    probe.remove();
    for (const { id, layer, anchor } of anchors) {
      anchor.remove();
      layer?.setAttribute('id', id);
    }
  }

  return { kill };
}
