'use client';

import { motion } from 'framer-motion';

export function HeroHeader() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-8 max-w-[1440px] mx-auto pt-24 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        {/* Left: Headline */}
        <div className="md:col-span-8 relative z-10">
          {/* Eyebrow */}
          <div className="overflow-hidden mb-4">
            <motion.span
              className="font-display text-[10px] uppercase tracking-[0.4em] block"
              style={{ color: '#919191' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
            >
              Full-Stack Developer
            </motion.span>
          </div>

          {/* Main headline */}
          <h1 className="text-display font-display mb-10 text-white">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                JACK
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              >
                KNOELL
              </motion.span>
            </span>
            {/* Stroke-only line — fills white on hover */}
            <motion.span
              className="block text-transparent hover:text-white transition-colors duration-700 cursor-default select-none"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              DEV.
            </motion.span>
          </h1>
        </div>

        {/* Right: Description + CTA */}
        <motion.div
          className="md:col-span-4 pb-4 md:pb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
        >
          <p
            className="max-w-xs text-sm leading-relaxed border-l-2 border-white/50 pl-6"
            style={{ color: '#c6c6c6' }}
          >
            Crafting high-performance web experiences through the lens of architectural precision
            and technical craft.
          </p>
          <div className="mt-8 pl-6">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary px-8 py-3"
            >
              View Work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Hero background — subtle grid pattern */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-4/5 -z-10"
        aria-hidden="true"
        style={{
          opacity: 0.15,
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 80px)',
        }}
      />
    </section>
  );
}
