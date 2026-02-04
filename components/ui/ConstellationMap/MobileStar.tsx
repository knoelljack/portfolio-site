'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Technology, AccentColor } from './types';
import { ENTRANCE_EASING } from './constants';

interface MobileStarProps {
  tech: Technology;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const accentColors: Record<AccentColor, string> = {
  coral: 'var(--accent-coral)',
  violet: 'var(--accent-violet)',
  tangerine: 'var(--accent-tangerine)',
};

export function MobileStar({ tech, index, isSelected, onSelect }: MobileStarProps) {
  // Randomized twinkle timing
  const twinkleDuration = useMemo(() => 2.5 + Math.random() * 2.5, []);
  const twinkleDelay = useMemo(() => Math.random() * 2, []);

  // Larger base size for mobile touch targets (min 44px)
  const baseSize = Math.max(18, 12 * tech.size * 1.5);
  const color = accentColors[tech.accent];

  return (
    <motion.button
      className="absolute star-glow"
      style={{
        left: `${tech.x}%`,
        top: `${tech.y}%`,
        transform: 'translate(-50%, -50%)',
        // Ensure minimum touch target of 44px
        minWidth: 44,
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.5 : 1,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: ENTRANCE_EASING,
      }}
      onClick={() => onSelect(tech.id)}
      aria-label={`${tech.name} - ${tech.proficiency}`}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: baseSize * 3,
          height: baseSize * 3,
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isSelected ? 1 : 0.4,
          scale: isSelected ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: baseSize * 1.8,
          height: baseSize * 1.8,
          background: `radial-gradient(circle, ${color}80 0%, transparent 60%)`,
        }}
        animate={{
          opacity: isSelected ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Core star */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: baseSize,
          height: baseSize,
          background: `radial-gradient(circle at 30% 30%, white 0%, ${color} 50%, ${color}cc 100%)`,
          boxShadow: `0 0 ${baseSize}px ${color}`,
        }}
      >
        {/* Twinkle animation overlay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/30"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.98, 1.05, 0.98],
          }}
          transition={{
            duration: twinkleDuration,
            repeat: Infinity,
            delay: twinkleDelay,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Always-visible tech name on mobile */}
      <motion.div
        className="absolute left-1/2 whitespace-nowrap pointer-events-none"
        style={{
          top: baseSize * 1.5 + 4,
          x: '-50%',
        }}
        animate={{
          opacity: isSelected ? 1 : 0.7,
          scale: isSelected ? 1.1 : 1,
        }}
      >
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            background: isSelected ? 'var(--glass-bg)' : 'transparent',
            backdropFilter: isSelected ? 'blur(8px)' : 'none',
            border: isSelected ? '1px solid var(--glass-border)' : 'none',
            color: 'var(--text-primary)',
          }}
        >
          {tech.name}
        </span>
      </motion.div>
    </motion.button>
  );
}
