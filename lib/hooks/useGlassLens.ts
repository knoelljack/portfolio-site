'use client';

import { useEffect, type RefObject } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

/**
 * Drives the hero's refracting glass lens.
 *
 * The headline is rasterised into a texture from the *measured* DOM line
 * boxes, so the canvas type is a pixel-accurate stand-in for the real `<h1>`
 * at any viewport size and font weight. The `<h1>` itself stays in the
 * document — it is only visually hidden once WebGL is confirmed working, so
 * search engines, screen readers and no-WebGL browsers all still get real
 * text.
 *
 * Hiding it is done by writing to the node directly rather than through React
 * state: the heading is an external thing this effect is synchronising with,
 * and doing it here swaps canvas-in for heading-out within a single frame, so
 * there is no window in which both or neither are painted.
 */

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform vec2 uLens;      // lens centre, uv space
  uniform float uRadius;   // lens radius, in units of viewport height
  uniform float uAspect;   // width / height
  uniform float uMagnify;
  uniform float uRefract;
  uniform float uChroma;
  uniform float uActive;   // lens fade-in
  uniform float uReveal;   // entrance 0 -> 1

  varying vec2 vUv;

  // Alpha of the type at a point, zero outside the texture so the lens never
  // smears edge pixels when it drifts past a border.
  float sampleA(vec2 uv) {
    vec2 inb = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    return texture2D(tMap, uv).a * inb.x * inb.y;
  }

  void main() {
    // Entrance: the type rises into place and converges out of an RGB-split
    // ghost — the same optics as the lens, applied to the whole field.
    float rev = uReveal;
    vec2 uv = vUv - vec2(0.0, (1.0 - rev) * 0.055);
    vec2 e = vec2((1.0 - rev) * 0.03, 0.0);

    vec2 p = (uv - uLens) * vec2(uAspect, 1.0);
    float d = length(p);
    float r = d / max(uRadius, 1e-4);
    vec2 dir = d > 1e-5 ? p / d : vec2(0.0);
    vec2 aspectFix = vec2(1.0 / uAspect, 1.0);

    // --- Outside the glass ---
    float pR = sampleA(uv + e);
    float pG = sampleA(uv);
    float pB = sampleA(uv - e);
    vec3 plainRgb = vec3(pR, pG, pB);
    float plainA = max(pR, max(pG, pB));

    // --- Under the glass ---
    // A liquid-glass slab, not a crystal ball. The middle is flat and evenly
    // magnified, the way a thick pane behaves, and all of the bending is
    // compressed into a band at the rim. Putting the distortion at the centre
    // instead is what makes these effects read as a glass sphere.
    float rc = min(r, 1.0);
    vec2 base = uLens + (uv - uLens) * (1.0 - uMagnify);

    float edge = smoothstep(0.40, 1.0, rc);
    float rim = edge * edge;
    vec2 dirFix = dir * aspectFix;
    vec2 suv = base + dirFix * rim * uRefract;
    vec2 ca = dirFix * rim * uChroma + e;

    float gR = sampleA(suv + ca);
    float gG = sampleA(suv);
    float gB = sampleA(suv - ca);
    vec3 glassRgb = vec3(gR, gG, gB) * 1.12;
    float glassA = max(gR, max(gG, gB));

    // Specular rim, brightest where a key light up and to the left would hit.
    float ring = smoothstep(0.90, 0.982, r) - smoothstep(0.982, 1.0, r);
    float key = 0.5 + 0.5 * dot(dir, normalize(vec2(-0.55, 0.83)));
    float spec = ring * (0.18 + 0.82 * key * key);

    // Flat body tint so the disc reads as an object rather than a hole.
    float body = (1.0 - edge * 0.45) * 0.03;

    glassRgb += spec * 0.85 + body;
    glassA = max(glassA, max(spec * 0.8, body));

    float inside = (1.0 - smoothstep(0.985, 1.0, r)) * uActive;
    vec3 rgb = mix(plainRgb, glassRgb, inside);
    float a = mix(plainA, glassA, inside);

    // Premultiplied output — additive highlights compose correctly.
    gl_FragColor = vec4(rgb * rev, a * rev);
  }
`;

const IDLE_AFTER_MS = 2200;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useGlassLens(
  hostRef: RefObject<HTMLDivElement | null>,
  titleRef: RefObject<HTMLElement | null>,
  discRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const host = hostRef.current;
    const title = titleRef.current;
    if (!host || !title || prefersReducedMotion()) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return; // No WebGL — the plain <h1> stays visible.
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '30'; // above .lens-disc
    host.appendChild(canvas);

    // Offscreen 2D surface the headline is rasterised onto.
    const textCanvas = document.createElement('canvas');
    const ctx = textCanvas.getContext('2d');
    if (!ctx) return;

    const texture = new Texture(gl, {
      image: textCanvas,
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      transparent: true,
      uniforms: {
        tMap: { value: texture },
        uLens: { value: [0.5, 0.5] },
        uRadius: { value: 0.2 },
        uAspect: { value: 1 },
        uMagnify: { value: 0.24 },
        uRefract: { value: 0.075 },
        uChroma: { value: 0.014 },
        uActive: { value: 0 },
        uReveal: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = 0;
    let height = 0;
    let radiusPx = 140;

    /** Rasterise the headline from its measured DOM boxes. */
    function paint() {
      if (!ctx) return;
      const hostRect = host!.getBoundingClientRect();
      const dpr = renderer.dpr;
      width = hostRect.width;
      height = hostRect.height;
      if (width < 2 || height < 2) return;

      textCanvas.width = Math.round(width * dpr);
      textCanvas.height = Math.round(height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.scale(dpr, dpr);

      const lines = title!.querySelectorAll<HTMLElement>('[data-lens-line]');
      lines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const cs = getComputedStyle(line);
        const text = (line.textContent ?? '').trim();
        if (!text || rect.width < 1) return;

        const fontSize = parseFloat(cs.fontSize);
        const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.2;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
        if ('letterSpacing' in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
            cs.letterSpacing;
        }

        const m = ctx.measureText(text);
        const ascent = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || fontSize * 0.8;
        const descent = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || fontSize * 0.2;
        const halfLeading = (lineHeight - (ascent + descent)) / 2;

        const x = rect.left - hostRect.left;
        const y = rect.top - hostRect.top + halfLeading + ascent;

        // Match the DOM box width exactly. Canvas letter-spacing support is
        // uneven, and the webfont may still be swapping in — squeezing to the
        // measured box keeps the two in register either way.
        const scale = m.width > 0 ? Math.min(1.6, Math.max(0.6, rect.width / m.width)) : 1;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, 1);
        if (line.dataset.lensOutline !== undefined) {
          ctx.lineWidth = Math.max(1, fontSize * 0.014);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.strokeText(text, 0, 0);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, 0, 0);
        }
        ctx.restore();
      });

      texture.image = textCanvas;
      texture.needsUpdate = true;
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      renderer.setSize(rect.width, rect.height);
      radiusPx = Math.max(78, Math.min(148, Math.min(rect.width, rect.height) * 0.14));
      program.uniforms.uAspect.value = rect.width / rect.height;
      program.uniforms.uRadius.value = radiusPx / rect.height;
      if (discRef.current) {
        discRef.current.style.width = `${radiusPx * 2}px`;
        discRef.current.style.height = `${radiusPx * 2}px`;
      }
      paint();
    }

    // --- Motion state -------------------------------------------------
    // Coordinates are "from the top" here and flipped on upload.
    const pointer = { x: 0.42, y: 0.45 };
    const current = { x: 0.42, y: 0.45 };
    let lastMove = 0;
    let idleWeight = 1; // starts idle — the lens drifts until you touch it
    let start = 0;
    let raf = 0;
    let disposed = false;

    function onPointerMove(e: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      if (rect.width < 2) return;
      pointer.x = Math.max(-0.15, Math.min(1.15, (e.clientX - rect.left) / rect.width));
      pointer.y = Math.max(-0.15, Math.min(1.15, (e.clientY - rect.top) / rect.height));
      lastMove = performance.now();
    }

    // --- Device tilt ----------------------------------------------------
    // Feeds the same `pointer` target as the mouse, so the smoothing, idle
    // handover and clamping are all shared.
    //
    // The first reading becomes the neutral point rather than assuming a
    // posture: people hold phones anywhere from flat on a table to near
    // vertical, and an absolute mapping puts the lens hard against an edge
    // for most of them.
    let tiltOrigin: { beta: number; gamma: number } | null = null;

    function onOrientation(e: DeviceOrientationEvent) {
      const { beta, gamma } = e;
      if (beta === null || gamma === null) return;
      if (!tiltOrigin) {
        tiltOrigin = { beta, gamma };
        return;
      }
      // A firm ~32° tilt takes the lens most of the way to an edge. Tighter
      // than that and small hand tremor throws it across the screen.
      const dx = (gamma - tiltOrigin.gamma) / 32;
      const dy = (beta - tiltOrigin.beta) / 32;
      pointer.x = Math.max(-0.1, Math.min(1.1, 0.5 + dx * 0.55));
      pointer.y = Math.max(-0.1, Math.min(1.1, 0.5 + dy * 0.55));
      lastMove = performance.now();
    }

    type PermissionCapableDOE = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    function enableTilt() {
      window.addEventListener('deviceorientation', onOrientation, { passive: true });
    }

    // Touch devices only. Some laptops and 2-in-1s expose an accelerometer,
    // and there tilt would fight the mouse for the same target.
    const wantsTilt =
      window.matchMedia('(pointer: coarse)').matches &&
      typeof DeviceOrientationEvent !== 'undefined';
    const DOE = wantsTilt ? (DeviceOrientationEvent as PermissionCapableDOE) : null;
    const needsTiltPermission = typeof DOE?.requestPermission === 'function';

    // iOS 13+ only grants motion access from inside a user gesture. Rather
    // than prompting on arrival, wait for the first deliberate touch on the
    // hero — the request then has visible context, and declining just leaves
    // the lens drifting with nothing else broken.
    function onFirstTouch() {
      DOE!.requestPermission!()
        .then((state) => {
          if (!disposed && state === 'granted') enableTilt();
        })
        .catch(() => {
          /* declined or unavailable — drift is the fallback */
        });
    }

    if (needsTiltPermission) {
      host.addEventListener('touchend', onFirstTouch, { passive: true, once: true });
    } else if (DOE) {
      // Android and anything else with a sensor: no permission gate.
      enableTilt();
    }

    function frame(now: number) {
      if (disposed) return;
      if (!start) start = now;
      const t = now - start;

      // Entrance
      const revT = Math.min(1, t / 1500);
      const reveal = 1 - Math.pow(1 - revT, 4);
      program.uniforms.uReveal.value = reveal;

      // The lens only appears once the type has settled.
      const actT = Math.max(0, Math.min(1, (t - 850) / 900));
      program.uniforms.uActive.value = actT * actT * (3 - 2 * actT);

      // Drift when the pointer has been still, follow it when it moves.
      // Asymmetric on purpose: grabbing the lens has to feel immediate, while
      // handing it back to its own path should be slow enough not to register
      // as the lens "leaving".
      const idle = now - lastMove > IDLE_AFTER_MS;
      idleWeight += ((idle ? 1 : 0) - idleWeight) * (idle ? 0.006 : 0.14);

      const driftX = 0.5 + 0.3 * Math.sin(now * 0.00027) + 0.06 * Math.sin(now * 0.00071);
      const driftY = 0.5 + 0.22 * Math.sin(now * 0.00041 + 1.3);

      const tx = pointer.x + (driftX - pointer.x) * idleWeight;
      const ty = pointer.y + (driftY - pointer.y) * idleWeight;

      current.x += (tx - current.x) * 0.12;
      current.y += (ty - current.y) * 0.12;

      program.uniforms.uLens.value = [current.x, 1 - current.y];

      if (discRef.current && width > 0) {
        discRef.current.style.transform = `translate3d(${current.x * width - radiusPx}px, ${
          current.y * height - radiusPx
        }px, 0)`;
        discRef.current.style.opacity = String(program.uniforms.uActive.value * 0.9);
      }

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(frame);
    }

    resize();
    // The canvas is now drawing the headline, so hand it over. See
    // .lens-handoff in globals.css — this suppresses paint only, keeping the
    // heading in layout and in the accessibility tree.
    title.classList.add('lens-handoff');
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // The headline is measured, so it has to be re-measured once the webfont
    // actually lands.
    if (document.fonts?.ready) void document.fonts.ready.then(() => !disposed && resize());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('deviceorientation', onOrientation);
      host.removeEventListener('touchend', onFirstTouch);
      ro.disconnect();
      canvas.remove();
      title.classList.remove('lens-handoff');
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    };
  }, [hostRef, titleRef, discRef]);
}
