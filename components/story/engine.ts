import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The page after the reel: one scrubbed timeline over a sticky stage.
 *
 *   hero → the orange pixel opens in the "o" of the name, the name parts
 *   around it, and the pixel flies out to become the first project's frame →
 *   seven projects, each building over the last in five columns while its
 *   title grows into its box → the last frame lifts off and lightens into
 *   the stack's stage → the scroll scrubs through every technology on it →
 *   the contact sheet slides up over the lot.
 *
 * Time on the timeline is measured in screens of scroll, so a beat's position
 * reads directly as "how far down". Nothing here renders until the reader
 * scrolls past a beat, so building it under the reel disturbs nothing.
 */

export type StoryControls = { kill: () => void };

/** The beats, in screens. Project k builds at `stepAt(k)` and is fully on
    screen at `shownAt(k)`; the stack takes over at `ABOUT`. */
const PIXEL_IN = 0.15;
const PART = 0.35;
const FLY = 0.45;
const WORK_IN = 0.95;
const FIRST = 1.05;
const WORK = 1.5;
const HOLD = 0.5;
const STEP = 0.9;
const BUILD = 0.4;
const stepAt = (k: number) => (k === 0 ? FIRST : WORK + HOLD + (k - 1) * STEP);
const shownAt = (k: number) => (k === 0 ? WORK : stepAt(k) + BUILD);

const COLUMNS = ['--c0', '--c1', '--c2', '--c3', '--c4'] as const;

export function createStory(track: HTMLElement): StoryControls {
  const html = document.documentElement;
  const one = <T extends Element = HTMLElement>(sel: string, root: ParentNode = track) =>
    root.querySelector<T>(sel)!;
  const all = <T extends Element = HTMLElement>(sel: string, root: ParentNode = track) =>
    Array.from(root.querySelectorAll<T>(sel));

  const len = parseFloat(getComputedStyle(track).getPropertyValue('--story-len')) || 13;
  const stage = one('.stage');
  const hero = one('.scene-hero');
  const heroParts = [one('.hero-role'), one('.hero-lede'), one('.hero-actions')];
  const letters = all('.hero-name .ch');
  const work = one('.scene-work');
  const head = one('.work-head');
  const ticks = one('.work-ticks');
  const marker = one('.work-marker');
  const tickButtons = all<HTMLButtonElement>('.work-tick');
  const projects = all('.project');
  const about = one('.scene-about');
  const lead = one('.about-lead-block');
  const groups = all('.stack-group');
  const stackStage = one('.stack-stage');
  const caption = one('.stack-caption');
  const names = all('.stack-name');
  const techCount = names.length;
  const pixel = one('.story-pixel');
  const box = one('.story-box');

  const LAST = projects.length - 1;
  const ABOUT_OUT = shownAt(LAST) + HOLD;
  const ABOUT = ABOUT_OUT + 1;
  const SCRUB_END = len - 1;
  /** The middle of technology `i`'s stretch of the scrub. */
  const techAt = (i: number) => ABOUT + ((i + 0.5) * (SCRUB_END - ABOUT)) / techCount;

  const parts = projects.map((p) => ({
    el: p,
    lines: all('.fit-line', p),
    chars: all('.fit-line .ch', p),
    text: one('.project-text', p),
    rest: [one('.project-meta', p), one('.project-summary', p), one('.project-link', p)],
    frame: one('.frame', p),
    layer: one('.shot-layer', p),
  }));

  // Everything the timeline writes to, and exactly which properties, so a
  // rebuild or a teardown clears only what it set — the server-rendered
  // inline widths on the title lines have to survive it.
  const CLEAR = 'transform,opacity,visibility,pointerEvents';
  const resets: [gsap.TweenTarget, string][] = [
    [[hero, ...heroParts, work, head, ticks, marker, about, ...Array.from(lead.children)], CLEAR],
    [[...groups, stackStage, caption], CLEAR],
    [letters, `${CLEAR},display`],
    [projects, CLEAR],
    [parts.flatMap((p) => [...p.lines, ...p.rest, p.text, p.frame]), CLEAR],
    [parts.flatMap((p) => p.chars), `${CLEAR},--wd`],
    [parts.map((p) => p.layer), COLUMNS.join(',')],
    [[pixel, box], `${CLEAR},left,top,width,height,backgroundColor`],
  ];

  let tl: gsap.core.Timeline | null = null;
  let st: ScrollTrigger | null = null;
  let scene: string | null | undefined;
  let tech = -1;

  /** Where the story is, read off the animation rather than the scrollbar,
      so everything keyed to it moves with the smoothed playhead. */
  const sync = () => {
    if (!tl) return;
    const t = tl.time();
    const next = t < WORK_IN - 0.05 ? null : t < ABOUT_OUT + 0.4 ? 'work' : 'about';
    if (next !== scene) {
      scene = next;
      window.dispatchEvent(new CustomEvent('story:scene', { detail: next }));
    }
    const index = Math.min(
      techCount - 1,
      Math.max(0, Math.floor(((t - ABOUT) / (SCRUB_END - ABOUT)) * techCount))
    );
    if (index !== tech) {
      tech = index;
      window.dispatchEvent(new CustomEvent('stack:scrub', { detail: index }));
    }
  };

  const build = () => {
    const sr = stage.getBoundingClientRect();
    const local = (r: DOMRect) => ({
      left: r.left - sr.left,
      top: r.top - sr.top,
      width: r.width,
      height: r.height,
    });

    // Synced from the timeline's own updates: with scrub smoothing the playhead
    // keeps easing toward the scroll after the scroll itself has stopped.
    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: sync });
    tl.set({}, {}, len);

    /* ---------- hero out: the name parts around the pixel ---------- */

    // The hero's own elements are revealed by the reel, so nothing here may
    // touch them before the reader scrolls: explicit from-values, rendered
    // only once the playhead reaches them.
    tl.fromTo(
      heroParts,
      { y: 0, opacity: 1 },
      {
        y: -36,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.in',
        immediateRender: false,
      },
      0.02
    );

    const o = letters.find((l) => l.textContent === 'o') ?? letters[Math.floor(letters.length / 2)];
    const or = o.getBoundingClientRect();
    const size = parseFloat(getComputedStyle(o).fontSize);
    // An inline box's top is its baseline less the face's ascent (1.09em in
    // Science Gothic); the counter's middle is half an x-height (0.51em) up.
    const ox = or.left + or.width / 2 - sr.left;
    const oy = or.top + size * (1.09 - 0.255) - sr.top;
    const dot = Math.max(6, size * 0.12);

    gsap.set(pixel, {
      left: ox - dot / 2,
      top: oy - dot / 2,
      width: dot,
      height: dot,
      autoAlpha: 0,
    });
    tl.fromTo(
      pixel,
      { autoAlpha: 1, scale: 0 },
      { scale: 1, duration: 0.18, ease: 'back.out(2.2)', immediateRender: false },
      PIXEL_IN
    );

    const reach = window.innerWidth * 0.55;
    // Letters only take a transform as inline blocks, which drops the kerning
    // the fitted line was solved with — so they switch only as they start to
    // move, and switch back if the reader scrolls back to the top.
    tl.set(letters, { display: 'inline-block' }, PART);
    tl.fromTo(
      letters,
      { x: 0, scale: 1, opacity: 1 },
      {
        x: (_: number, el: Element) => {
          const r = el.getBoundingClientRect();
          const dx = r.left + r.width / 2 - sr.left - ox;
          return Math.abs(dx) < 2 ? 0 : Math.sign(dx) * (reach + Math.abs(dx) * 0.6);
        },
        scale: (_: number, el: Element) => (el === o ? 1.6 : 1),
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        stagger: { each: 0.012, from: letters.indexOf(o) },
        immediateRender: false,
      },
      PART
    );
    tl.set(hero, { opacity: 0, pointerEvents: 'none' }, PART + 0.75);

    /* ---------- the pixel becomes the first frame ---------- */

    const fr = local(parts[0].frame.getBoundingClientRect());
    tl.to(pixel, { ...fr, duration: 0.6, ease: 'power3.inOut' }, FLY);

    // Hidden by opacity, never visibility: a hidden layer's links would drop
    // out of the tab order, and focus is how a keyboard reader gets to them.
    gsap.set(work, { opacity: 0, pointerEvents: 'none' });
    tl.set(work, { opacity: 1, pointerEvents: 'auto' }, WORK_IN);
    tl.fromTo(head, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.25 }, WORK_IN);
    tl.fromTo(ticks, { opacity: 0 }, { opacity: 1, duration: 0.2 }, WORK_IN + 0.05);

    /* ---------- the projects, each built over the last ---------- */

    const pitch =
      tickButtons.length > 1 ? tickButtons[1].offsetLeft - tickButtons[0].offsetLeft : 0;
    gsap.set(projects, { opacity: 0, pointerEvents: 'none' });
    // A staggered tween only applies its from-values to each target when that
    // target's own turn comes, so every staggered starting state is set here:
    // otherwise a title's second line sits in place until its turn, and the
    // later letters flash at full width before shrinking to begin.
    for (const p of parts) {
      gsap.set(p.lines, { yPercent: 135 });
      gsap.set(p.chars, { '--wd': 50 });
      gsap.set(p.rest, { opacity: 0, y: 14 });
    }

    parts.forEach((p, k) => {
      const t = stepAt(k);
      tl!.set(p.el, { opacity: 1, pointerEvents: 'auto' }, t);
      COLUMNS.forEach((c, j) => {
        tl!.fromTo(
          p.layer,
          { [c]: '0%' },
          { [c]: '100%', duration: 0.26, ease: 'power2.inOut' },
          t + 0.04 + j * 0.035
        );
      });
      // The outgoing title has left by the time this one rises into its place.
      const textAt = k === 0 ? t + 0.08 : t + 0.16;
      // Lines travel well past their own height: the line box is tight, and a
      // descender would otherwise still hang inside the mask.
      tl!.fromTo(
        p.lines,
        { yPercent: 135 },
        { yPercent: 0, duration: 0.24, stagger: 0.05, ease: 'power3.out' },
        textAt
      );
      tl!.fromTo(
        p.chars,
        { '--wd': 50 },
        {
          '--wd': (_: number, el: Element) =>
            parseFloat(getComputedStyle(el.parentElement!).getPropertyValue('--wd')) || 100,
          duration: 0.28,
          stagger: 0.008,
          ease: 'power2.out',
        },
        textAt
      );
      tl!.fromTo(
        p.rest,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.18, stagger: 0.04, ease: 'power2.out' },
        textAt + 0.06
      );
      if (k > 0) {
        tl!.to(marker, { x: k * pitch, duration: 0.3, ease: 'power2.inOut' }, t);
        leave(parts[k - 1], t);
      }
    });
    // Gone the moment the first screenshot is whole, before "work" — where a
    // deep link lands — so a tilted frame never shows orange round its edge.
    tl.set(pixel, { autoAlpha: 0 }, FIRST + 0.44);

    function leave(p: (typeof parts)[number], t: number) {
      tl!.to(p.lines, { yPercent: -135, duration: 0.16, stagger: 0.03, ease: 'power2.in' }, t);
      tl!.to(p.chars, { '--wd': 50, duration: 0.16, stagger: 0.005, ease: 'power2.in' }, t);
      tl!.to(p.rest, { opacity: 0, y: -10, duration: 0.1, stagger: 0.02 }, t);
      tl!.set(p.text, { opacity: 0 }, t + 0.22);
      tl!.set(p.el, { opacity: 0, pointerEvents: 'none' }, t + 0.45);
    }

    /* ---------- the last frame becomes the stack's stage ---------- */

    leave(parts[LAST], ABOUT_OUT);
    tl.to([head, ticks], { opacity: 0, y: -10, duration: 0.2 }, ABOUT_OUT);

    // The last frame — Drive Stories' night plate — lifts off whole and
    // lightens into the stage on its way across.
    gsap.set(about, { opacity: 0, pointerEvents: 'none' });
    gsap.set(Array.from(lead.children), { opacity: 0, y: 18 });
    gsap.set(groups, { opacity: 0, y: 12 });
    const stageAt = local(stackStage.getBoundingClientRect());
    gsap.set(box, { ...fr, autoAlpha: 0, backgroundColor: '#0b0b0b' });
    tl.set(box, { autoAlpha: 1 }, ABOUT_OUT + 0.05);
    tl.set(parts[LAST].frame, { opacity: 0 }, ABOUT_OUT + 0.05);
    tl.to(box, { ...stageAt, duration: 0.6, ease: 'power3.inOut' }, ABOUT_OUT + 0.15);
    tl.to(
      box,
      { backgroundColor: '#fbfbfb', duration: 0.4, ease: 'power1.inOut' },
      ABOUT_OUT + 0.3
    );
    tl.set(work, { opacity: 0, pointerEvents: 'none' }, ABOUT_OUT + 0.5);
    tl.set(about, { opacity: 1, pointerEvents: 'auto' }, ABOUT_OUT + 0.4);
    tl.fromTo(
      Array.from(lead.children),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: 'power2.out' },
      ABOUT_OUT + 0.45
    );
    tl.fromTo(
      groups,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.2, stagger: 0.04, ease: 'power2.out' },
      ABOUT_OUT + 0.55
    );
    tl.fromTo(
      [stackStage, caption],
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      ABOUT_OUT + 0.72
    );
    tl.set(box, { autoAlpha: 0 }, ABOUT_OUT + 0.95);

    // The last screen is the contact sheet sliding up; the stack sinks back a
    // little beneath it, so the curtain reads as passing in front.
    tl.to(about, { scale: 0.94, y: () => -0.04 * svh(), duration: 1, ease: 'power1.in' }, len - 1);

    st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      // The stage is stuck for exactly `len` small-viewport heights; measuring
      // that, rather than "bottom bottom", keeps the timeline's end on the
      // stage's release whatever the address bar is doing.
      end: () => `+=${len * svh()}`,
      animation: tl,
      scrub: 0.5,
      // No invalidateOnRefresh: it reverts the timeline on every refresh —
      // including the one on window load — which wipes the starting states
      // set above. Layout-dependent values are rebuilt on resize instead, and
      // a function `end` is re-measured on every refresh regardless.
      onRefresh: sync,
    });
    sync();
  };

  const teardownTimeline = () => {
    st?.kill();
    tl?.kill();
    st = null;
    tl = null;
    for (const [targets, props] of resets) gsap.set(targets, { clearProps: props });
    work.style.removeProperty('--rx');
    work.style.removeProperty('--ry');
  };

  /* ---------- getting around: nav, ticks, deep links, focus ---------- */

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const svh = () => probe.offsetHeight || window.innerHeight;

  const timeFor = (id: string) =>
    id === 'top' ? 0 : id === 'work' ? shownAt(0) : id === 'about' ? ABOUT + 0.01 : null;

  const scrollToTime = (t: number, smooth: boolean) => {
    if (!st) return;
    const y = st.start + (t / len) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' });
  };

  // The scenes' ids move from their layers on the stage to anchors in the
  // scroll track, each where its scene is on screen. A fragment — a nav link,
  // a typed hash, back and forward — is then the browser's own scroll to the
  // right place, with nothing to intercept.
  const anchors = (['top', 'work', 'about'] as const).map((id) => {
    const layer = document.getElementById(id);
    const anchor = document.createElement('span');
    anchor.className = 'story-anchor';
    anchor.style.top = `calc(${timeFor(id)} * 100svh)`;
    layer?.removeAttribute('id');
    anchor.id = id;
    track.appendChild(anchor);
    return { id, layer, anchor };
  });

  const onClick = (e: MouseEvent) => {
    const tick = e.target instanceof Element ? e.target.closest<HTMLElement>('.work-tick') : null;
    if (tick) scrollToTime(shownAt(Number(tick.dataset.tick)), true);
  };

  // A keyboard reader tabbing into a scene that is not on screen is carried
  // to it, so focus never lands on something the stage is hiding.
  const onFocus = (e: FocusEvent) => {
    if (!tl || !(e.target instanceof Element) || !track.contains(e.target)) return;
    const project = e.target.closest<HTMLElement>('.project');
    const now = tl.time();
    // A technology is carried to its own place in the scrub, so the scroll
    // then agrees with the name that has focus instead of drawing another.
    const name = e.target.closest('.stack-name');
    if (name) {
      const i = names.indexOf(name as HTMLElement);
      // Past SCRUB_END the contact sheet is rising over the stack.
      if (i !== tech || now < ABOUT - 0.05 || now > SCRUB_END) scrollToTime(techAt(i), false);
      return;
    }
    const t = project
      ? shownAt(Number(project.dataset.i))
      : e.target.closest('.scene-about')
        ? ABOUT + 0.01
        : e.target.closest('.scene-hero')
          ? 0
          : null;
    if (t === null) return;
    const showing = project
      ? Math.abs(now - t) < 0.3
      : t === 0
        ? now < 0.05
        : now >= ABOUT - 0.2 && now <= SCRUB_END;
    if (!showing) scrollToTime(t, false);
  };

  /* ---------- the frame leans toward the pointer ---------- */

  const tilt = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 };
  const lean = () => {
    tilt.x += (tilt.tx - tilt.x) * 0.12;
    tilt.y += (tilt.ty - tilt.y) * 0.12;
    work.style.setProperty('--rx', `${tilt.x.toFixed(2)}deg`);
    work.style.setProperty('--ry', `${tilt.y.toFixed(2)}deg`);
    const settled = Math.abs(tilt.tx - tilt.x) < 0.02 && Math.abs(tilt.ty - tilt.y) < 0.02;
    tilt.raf = settled ? 0 : requestAnimationFrame(lean);
  };
  const aim = (x: number, y: number) => {
    tilt.tx = x;
    tilt.ty = y;
    if (!tilt.raf) tilt.raf = requestAnimationFrame(lean);
  };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') {
      aim(-(e.clientY / window.innerHeight - 0.5) * 8, (e.clientX / window.innerWidth - 0.5) * 12);
    } else if (e.buttons && e.target instanceof Element && e.target.closest('.project-shot')) {
      // A finger dragged across the frame tilts it; a vertical drag still
      // scrolls, because the frame only claims horizontal panning.
      const r = (e.target.closest('.project-shot') as HTMLElement).getBoundingClientRect();
      aim(0, ((e.clientX - r.left) / r.width - 0.5) * 18);
    }
  };
  const onRelease = () => aim(0, 0);

  /* ---------- lifecycle ---------- */

  let width = window.innerWidth;
  let small = svh();
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // A phone's address bar coming and going changes the window's height
      // but not `svh`, which every scene is laid out in — so that alone
      // rebuilds nothing. A new width, or a window resized for real, does.
      if (window.innerWidth === width && svh() === small) return;
      width = window.innerWidth;
      small = svh();
      const progress = st?.progress ?? 0;
      teardownTimeline();
      build();
      ScrollTrigger.refresh();
      if (st)
        window.scrollTo({ top: st.start + progress * (st.end - st.start), behavior: 'instant' });
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
  for (const img of all<HTMLImageElement>('.project img')) img.loading = 'eager';

  ScrollTrigger.config({ ignoreMobileResize: true });
  build();
  ScrollTrigger.refresh();

  // A deep link is landed again here: one into the story was first scrolled
  // to its layer before the anchors existed, and any other (the contact
  // sheet) had its smooth fragment scroll frozen mid-flight when the refresh
  // above recorded and restored the scroll position. Once more after load,
  // in case the browser repeats its own fragment scroll — unless the reader
  // has started scrolling for themselves.
  const fragment = location.hash.slice(1);
  const landing = fragment ? timeFor(fragment) : null;
  const target = fragment && landing === null ? document.getElementById(fragment) : null;
  let steered = false;
  const onInput = () => {
    steered = true;
  };
  const land = () => {
    if (steered) return;
    if (landing !== null && landing > 0) scrollToTime(landing, false);
    else target?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  land();
  if ((landing !== null && landing > 0) || target) {
    window.addEventListener('load', land, { once: true });
    window.setTimeout(land, 400);
    for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
      window.addEventListener(type, onInput, { once: true, passive: true });
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('focusin', onFocus);
  work.addEventListener('pointermove', onPointer);
  work.addEventListener('pointerleave', onRelease);
  work.addEventListener('pointerup', onRelease);
  work.addEventListener('pointercancel', onRelease);
  window.addEventListener('resize', onResize);
  motion.addEventListener('change', onMotion);

  function kill() {
    window.clearTimeout(resizeTimer);
    cancelAnimationFrame(tilt.raf);
    document.removeEventListener('click', onClick);
    document.removeEventListener('focusin', onFocus);
    work.removeEventListener('pointermove', onPointer);
    work.removeEventListener('pointerleave', onRelease);
    work.removeEventListener('pointerup', onRelease);
    work.removeEventListener('pointercancel', onRelease);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', land);
    for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
      window.removeEventListener(type, onInput);
    }
    motion.removeEventListener('change', onMotion);
    teardownTimeline();
    probe.remove();
    for (const { id, layer, anchor } of anchors) {
      anchor.remove();
      layer?.setAttribute('id', id);
    }
  }

  return { kill };
}
