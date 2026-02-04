'use client';

import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { ParticleField } from '@/components/ui/ParticleField';
import { MagneticButton } from '@/components/ui/MagneticButton';

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
        delay: index * 0.08,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

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
  const name = 'Jack';

  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <AuroraBackground />
      <ParticleField />

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(250,250,250,0.5) 40%, var(--background) 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-display font-display mb-10">
          <span className="text-gradient-animated">
            <AnimatedText text={name} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <MagneticButton href="#projects">View Projects</MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
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
