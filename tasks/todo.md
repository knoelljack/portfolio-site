# Portfolio revamp — "gallery"

Replaces the liquid-glass redesign. Branch: `redesign/gallery`

## Direction (confirmed with Jack)

| Decision   | Choice                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| Palette    | Light gallery-grey canvas; saturated colour arrives only via work panels |
| Imagery    | Real screenshots of the 7 live client sites, captured headless           |
| Structure  | Single page — hero, work carousel, about, contact                        |
| References | xhulia.com, huehaus.design, alice.inc — light, editorial, type-led       |

## The idea

Jack's work is _other people's brands_ — eight identities from crimson healthcare
to acid-green renewables. So the site itself is a neutral, precise frame and the
client work supplies every bit of chroma. That is the whole concept: a chassis
built to carry someone else's colour.

**Signature:** the page's ambient tint morphs to the active project's real brand
hue as you move through the carousel. One bold move; everything else stays quiet.

## Tokens

- **Canvas** `#E9E9E5` gallery grey · **Ink** `#0E0E11` · accent = per-project brand colour
- **Display** Instrument Serif (italic carries the accent word)
- **Body** Archivo · **Utility** JetBrains Mono (eyebrows, indices, tech tags)

Brand colours pulled from the logo SVGs, not guessed:
EyePromise `#1546E0` · CareDx `#A6192E` · Northern Trust `#115740` ·
Vanguard `#23D244` · Edenspiekermann `#FB263B` · Selby Lane `#0D2B4E` ·
BrdSrc `#0F5563` · Drive Stories `#222935`

## Tasks

- [x] 0. Capture screenshots of the 7 live sites (CDP; strips consent + modals)
- [x] 1. Design system rewrite in `globals.css`
- [x] 2. Fonts + layout shell
- [x] 3. Hero
- [x] 4. Work carousel — native scroll-snap, tint follows active panel
- [x] 5. About
- [x] 6. Contact (keep the working Resend route)
- [x] 7. Footer + nav
- [x] 8. Remove dead glass/WebGL code
- [x] 9. Build, lint, and verify in a real browser at 3 widths

## Known gap

**Drive Stories has no web URL** — it's an App Store app, so there is no site to
screenshot. Built as a deliberately different panel (no screenshot, App Store
badge) rather than left broken. Jack can drop app screens in `public/work/` later.

## Carousel note

The old ProjectsSection hijacked vertical scroll to drive horizontal movement —
it broke the scrollbar, fought trackpads, and had no keyboard path. Replaced with
native CSS scroll-snap: real swipe on touch, real focus order, arrow-key support,
and no measurement of `scrollWidth` against `innerWidth` on every resize.

## Review

Caught while verifying in the browser rather than by assuming it worked:

- **Descenders were being sliced.** `.rise` masks each hero line with
  `overflow: hidden`; at a 0.92 line-height that cut the tail off the `y` in
  "remembered by." Fixed with a `padding-bottom` / negative `margin-bottom` pair.
- **Panel titles fell below the fold.** At the original 16:10 / 1080px the image
  alone filled the viewport, so no project name was visible on desktop. The shot
  is now capped at `46svh` and the panel narrowed to 900px.
- **`--ink-3` failed contrast** at 2.7:1 on the paper — every mono label on the
  site is set in it, at 11px. Darkened to `#66666f` (4.6:1).
- **The neutral wash read as smoke.** Falling back to near-black tinted the page
  grey off the carousel; the rest state is now a cool neutral instead.

Verified: production build, eslint, prettier and `tsc --noEmit` all clean; hero
renders fully under `prefers-reduced-motion: reduce`; `--accent` confirmed to
track the active panel (`35 210 68` on Vanguard, `251 38 59` on Edenspiekermann).

Dropped 11 dependencies that lost their last consumer — framer-motion, ogl,
react-icons, cva, tailwindcss-animate, tw-animate-css and five Radix packages.
`clsx` / `tailwind-merge` / `lib/utils.ts` stay: they are the shadcn substrate,
still wired up by `components.json` if a component gets added later.
