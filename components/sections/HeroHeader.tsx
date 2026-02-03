'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedCharacterProps {
  char: string;
  index: number;
}

function AnimatedCharacter({ char, index }: AnimatedCharacterProps) {
  return (
    <motion.span
      className="inline-block"
      initial={{ y: 100, rotateX: -90, opacity: 0 }}
      animate={{ y: 0, rotateX: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
        delay: index * 0.04,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
}

function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <AnimatedCharacter key={index} char={char} index={index} />
      ))}
    </span>
  );
}

export function HeroHeader() {
  const greeting = "Hi, I'm";
  const name = 'Jack';
  const tagline = 'Full-Stack Developer & Creative Technologist';

  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="max-w-5xl">
          {/* Main heading */}
          <h1 className="text-display font-display mb-6">
            <div className="text-[var(--text-primary)]">
              <AnimatedText text={greeting} />
            </div>
            <div className="text-gradient-animated">
              <AnimatedText text={name} className="block" />
            </div>
          </h1>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link
              href="#projects"
              className="btn-gradient px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
            >
              View Projects
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="#contact"
              className="btn-outline px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-[var(--text-muted)]">Scroll</span>
          <div className="w-6 h-10 border-2 border-[var(--text-muted)] rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
