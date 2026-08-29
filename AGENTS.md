# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## Building and running

`npm run build` fails without a `RESEND_API_KEY` in the environment, even though
nothing about the build needs to send mail: `app/api/contact/route.ts` constructs
the Resend client at module scope, and Next collects page data for the route at
build time. Any non-empty value gets you a build. The same applies to `npm run dev`
if you intend to exercise the contact form.

## Sharp edges

- **Turbopack dev serves stale CSS.** Edits to `app/globals.css` frequently do not
  reach the browser, and the page renders against the previous stylesheet with no
  error. Before concluding a CSS change "didn't work", diff the served chunk
  (`curl` the `/_next/static/.../*.css` referenced by the page) against the source.
  The reliable fix is `rm -rf .next` and restarting the dev server.
- **Lightning CSS rewrites `overflow-x: clip` to `hidden`** for this project's
  browser targets, so `clip` cannot be used to get a clipping guard that spares
  `position: sticky`. See the comment on `html` in `app/globals.css`.

## Design system

`app/globals.css` is the single source of truth for the visual language — tokens,
type scale, and every component class the sections use. Sections in
`components/sections/` are expected to reach for those classes rather than
re-deriving colour or spacing in Tailwind utilities.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
