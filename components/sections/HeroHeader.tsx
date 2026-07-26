'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useGlassLens } from '@/lib/hooks/useGlassLens';

export function HeroHeader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  // Takes over the headline once WebGL is confirmed working, hiding the <h1>
  // directly. Until then — and under reduced motion, or with no WebGL — the
  // heading below renders as ordinary text.
  useGlassLens(hostRef, titleRef, discRef);

  return (
    <div
      ref={hostRef}
      className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-10 max-w-[1440px] mx-auto pt-32 pb-20"
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-end">
        {/* Left — the headline the lens refracts */}
        <div className="md:col-span-8">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full btn-glass"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.25 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            <span
              className="font-display text-[12px] font-semibold tracking-tight"
              style={{ color: 'var(--text-secondary)' }}
            >
              Full-stack developer
            </span>
          </motion.div>

          {/* Kept in the document for search engines, screen readers and any
              browser without WebGL — hidden only once the canvas is live. */}
          <h1 ref={titleRef} className="text-display mb-12 text-white">
            <span className="block">
              <span data-lens-line className="inline-block">
                Jack
              </span>
            </span>
            <span className="block">
              <span data-lens-line className="inline-block">
                Knoell
              </span>
            </span>
            <span className="block">
              <span data-lens-line data-lens-outline className="hero-outline inline-block">
                Dev.
              </span>
            </span>
          </h1>
        </div>

        {/* Right — context and the way in */}
        <motion.div
          className="md:col-span-4 md:pb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.85 }}
        >
          <div className="glass glass-sheen p-6 md:p-7">
            <p
              className="relative z-10 text-[15px] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Crafting high-performance web experiences through the lens of architectural precision
              and technical craft.
            </p>
            <div className="relative z-10 mt-7">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-solid px-7 py-3.5 w-full"
              >
                View work
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="relative z-10 mt-16 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <ArrowDown className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
        <span className="label" style={{ color: 'var(--text-faint)' }}>
          Scroll
        </span>
      </motion.div>

      {/* The glass disc itself — sits above the content so its backdrop-filter
          bends the ambient field and the copy behind it. The canvas the hook
          appends renders the refracted headline on top of this. */}
      <div ref={discRef} className="lens-disc" aria-hidden="true" />
    </div>
  );
}
