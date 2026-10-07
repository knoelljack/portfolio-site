import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

/**
 * Scroll, one scene at a time. Inside the story the page's own scrolling is
 * taken over: a wheel turn, a trackpad swipe, a finger's swipe or a key press
 * moves exactly one scene, at an eased pace of its own, and anything that
 * arrives while that move is playing is spent rather than queued. Past the
 * story — the contact page — scrolling is the browser's own again.
 *
 * Long jumps (Home, End, a progress square) are made under a quick column
 * flood instead, so nothing ever fast-forwards through the scenes between.
 */

export type Pacer = {
  /** Jump to a scroll position under the cover. */
  cut: (y: number) => void;
  /** Drop any move in flight, for a jump that has to land at once. */
  stop: () => void;
  destroy: () => void;
};

type Options = {
  /** Scene rests as scroll positions, in order; the last is the story's end.
      Read fresh on every input, so a rebuild needs no notice. */
  beats: () => number[];
  /** Input belongs to something else just now: the reel, or the menu. */
  blocked: () => boolean;
  /** The columns a long jump floods the screen with. */
  cover: () => HTMLElement[];
};

/** A one-screen move, in seconds; longer moves take a little longer. */
const STEP = 1.25;
/** Away briskly — the reader sees their input answered at once — and a long,
    soft landing as the next scene settles. */
const PACE = CustomEase.create('pace', 'M0,0 C0.32,0.08 0.16,1 1,1');

/** Wheel silence that ends a gesture, and how long a steadily turning wheel
    waits after a move before it is allowed another. */
const IDLE = 220;
const AGAIN = 320;
/** A finger has to mean it before it moves a scene. */
const SWIPE = 16;

export function createPacer({ beats, blocked, cover }: Options): Pacer {
  let move: gsap.core.Animation | null = null;
  let doneAt = 0;

  const to = (y: number) => window.scrollTo({ top: y, behavior: 'instant' });

  const end = () => beats().at(-1) ?? 0;

  /**
   * Whether the story takes an input heading `dir` from where the page is:
   * anywhere inside the story — except back past the first scene, which is
   * left to the browser's own bounce — and back into it from the very top of
   * the contact page.
   */
  const owns = (dir: number) => {
    const y = window.scrollY;
    const last = end();
    if (y < last - 2) return dir > 0 || y > 1;
    return dir < 0 && y <= last + 2;
  };

  const animate = (target: number) => {
    const from = window.scrollY;
    const screens = Math.abs(target - from) / window.innerHeight;
    const proxy = { y: from };
    move = gsap.to(proxy, {
      y: target,
      duration: STEP * Math.max(0.4, screens) ** 0.6,
      ease: PACE,
      onUpdate: () => to(proxy.y),
      onComplete: () => {
        move = null;
        doneAt = performance.now();
      },
    });
  };

  /** One scene on in `dir`, from wherever the page is. */
  const go = (dir: number) => {
    const ys = beats();
    const y = window.scrollY;
    const target = dir > 0 ? ys.find((b) => b > y + 2) : ys.findLast((b) => b < y - 2);
    if (target !== undefined) animate(target);
  };

  const cut = (y: number) => {
    if (move) return;
    const cols = cover().filter((c) => c.offsetParent !== null);
    if (!cols.length) {
      to(y);
      return;
    }
    move = gsap
      .timeline({
        onComplete: () => {
          move = null;
          doneAt = performance.now();
        },
      })
      .fromTo(
        cols,
        { scaleY: 0, transformOrigin: (i: number) => (i % 2 ? '50% 100%' : '50% 0%') },
        { scaleY: 1, duration: 0.3, stagger: 0.02, ease: 'expo.inOut' }
      )
      .call(() => to(y))
      .to(cols, { scaleY: 0, duration: 0.34, stagger: 0.02, ease: 'expo.inOut' }, '+=0.04');
  };

  // Dropped, not finished: finishing would carry the page on to the old
  // target after the jump has already put it somewhere else.
  const stop = () => {
    move?.kill();
    move = null;
    gsap.set(cover(), { scaleY: 0 });
  };

  /* ---------- wheel and trackpad ---------- */

  let lastWheel = 0;
  let peak = 0;
  let recent: number[] = [];
  let spent = false;

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return;
    const dy =
      e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (Math.abs(e.deltaX) > Math.abs(dy)) return;
    const d = Math.abs(dy);
    const dir = Math.sign(dy);
    const now = performance.now();

    // A trackpad keeps sending a swipe's momentum long after the fingers have
    // lifted, falling away as it goes. A gesture is new after a silence, or
    // when the wheel suddenly pushes harder than it just was: a fresh swipe
    // landing on the tail of the last.
    const fresh = now - lastWheel > IDLE;
    const rising = recent.length >= 2 && d > 6 && d > Math.max(...recent) * 1.25;
    lastWheel = now;
    if (fresh || rising) {
      peak = d;
      recent = [];
      // A gesture begun under the reel, the menu or a move in flight is spent:
      // input never queues up behind a scene.
      spent = blocked() || !!move;
    }
    peak = Math.max(peak, d);
    recent.push(d);
    if (recent.length > 4) recent.shift();

    if (!dir || blocked() || !owns(dir)) return;
    e.preventDefault();
    if (move) return;
    // A wheel turned steadily — not falling away like momentum — is asking
    // for the next scene too, once this one has landed.
    const steady = d >= peak * 0.85 && now - doneAt > AGAIN;
    if (!spent || steady) {
      spent = true;
      go(dir);
    }
  };

  /* ---------- touch ---------- */

  let touch: { x: number; y: number; spent: boolean } | null = null;

  const onTouchStart = (e: TouchEvent) => {
    touch =
      e.touches.length === 1
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY, spent: blocked() || !!move }
        : null;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touch || e.touches.length !== 1 || blocked()) return;
    const dx = touch.x - e.touches[0].clientX;
    const dy = touch.y - e.touches[0].clientY;
    const dir = Math.sign(dy) || 1;
    // Pulling down at the first scene, or scrolling on through the contact
    // page, stays the browser's: its bounce and its address bar are untouched.
    if (!owns(dir)) return;
    // Every other move is ours from the first one, so the browser never
    // commits the gesture to a scroll of its own. A sideways drag still
    // reaches the card and the name as pointer events.
    if (e.cancelable) e.preventDefault();
    if (touch.spent || move || Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < SWIPE) return;
    touch.spent = true;
    go(dir);
  };

  const onTouchEnd = () => {
    touch = null;
  };

  /* ---------- keys ---------- */

  const onKey = (e: KeyboardEvent) => {
    if (blocked() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target instanceof Element ? e.target : null;
    if (el?.closest('input, textarea, select, [contenteditable]')) return;
    let dir = 0;
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        dir = 1;
        break;
      case 'ArrowUp':
      case 'PageUp':
        dir = -1;
        break;
      case ' ':
        // Space presses a focused button; it only scrolls from anywhere else.
        if (el?.closest('button, summary')) return;
        dir = e.shiftKey ? -1 : 1;
        break;
      case 'Home':
        if (window.scrollY <= 1) return;
        e.preventDefault();
        cut(0);
        return;
      case 'End':
        if (window.scrollY >= end() - 2) return;
        e.preventDefault();
        cut(document.documentElement.scrollHeight);
        return;
      default:
        return;
    }
    if (!owns(dir)) return;
    e.preventDefault();
    if (!move) go(dir);
  };

  /* ---------- anything else: the scrollbar, find in page ---------- */

  // A scroll the pacer did not make — a dragged scrollbar, a search jumping
  // to a match — is settled onto the nearest scene once it stops.
  let settling = 0;
  const onScroll = () => {
    if (move) return;
    window.clearTimeout(settling);
    settling = window.setTimeout(() => {
      if (move || blocked()) return;
      const ys = beats();
      const y = window.scrollY;
      if (y >= end() - 2) return;
      const nearest = ys.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a), ys[0]);
      if (Math.abs(nearest - y) > 2) animate(nearest);
    }, 150);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', onScroll, { passive: true });

  return {
    cut,
    stop,
    destroy() {
      move?.kill();
      move = null;
      window.clearTimeout(settling);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      gsap.set(cover(), { clearProps: 'transform' });
    },
  };
}
