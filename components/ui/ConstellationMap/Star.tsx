'use client';

import { motion, useSpring } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { Technology } from './types';
import { SPRING_CONFIG, ENTRANCE_EASING, ACCENT_COLORS } from './constants';

interface StarProps {
  tech: Technology;
  index: number;
  isHovered: boolean;
  isConnected: boolean;
  isSelected: boolean;
  proximity: number;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export function Star({
  tech,
  index,
  isHovered,
  isConnected,
  isSelected,
  proximity,
  onHover,
  onClick,
}: StarProps) {
  // Randomized twinkle timing to avoid synchronization
  const twinkleDuration = useMemo(() => 2.5 + Math.random() * 2.5, []);
  const twinkleDelay = useMemo(() => Math.random() * 2, []);

  // Base size calculation
  const baseSize = 12 * tech.size;

  // Spring for smooth hover/select transitions
  const scaleSpring = useSpring(1, SPRING_CONFIG);
  const glowSpring = useSpring(0.3, SPRING_CONFIG);

  useEffect(() => {
    if (isSelected) {
      scaleSpring.set(1.5);
      glowSpring.set(1);
    } else if (isHovered) {
      scaleSpring.set(1.3);
      glowSpring.set(1);
    } else if (isConnected) {
      scaleSpring.set(1.15);
      glowSpring.set(0.8);
    } else {
      // Proximity-based glow
      const proximityScale = 1 + proximity * 0.15;
      const proximityGlow = 0.3 + proximity * 0.5;
      scaleSpring.set(proximityScale);
      glowSpring.set(proximityGlow);
    }
  }, [isSelected, isHovered, isConnected, proximity, scaleSpring, glowSpring]);

  const color = ACCENT_COLORS[tech.accent];

  return (
    <motion.div
      className="absolute star-glow cursor-pointer"
      style={{
        left: `${tech.x}%`,
        top: `${tech.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: ENTRANCE_EASING,
      }}
      onMouseEnter={() => onHover(tech.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(tech.id)}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: baseSize * 3,
          height: baseSize * 3,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          scale: scaleSpring,
          opacity: glowSpring,
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: baseSize * 1.8,
          height: baseSize * 1.8,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: `radial-gradient(circle, ${color}80 0%, transparent 60%)`,
          scale: scaleSpring,
          opacity: glowSpring,
        }}
      />

      {/* Core star */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: baseSize,
          height: baseSize,
          background: `radial-gradient(circle at 30% 30%, white 0%, ${color} 50%, ${color}cc 100%)`,
          boxShadow: `0 0 ${baseSize}px ${color}`,
          scale: scaleSpring,
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

      {/* Tech name label (visible on hover/select) */}
      <motion.div
        className="absolute left-1/2 whitespace-nowrap pointer-events-none"
        style={{
          top: baseSize * 1.5 + 8,
          x: '-50%',
        }}
        initial={{ opacity: 0, y: -5 }}
        animate={{
          opacity: isHovered || isSelected ? 1 : 0,
          y: isHovered || isSelected ? 0 : -5,
        }}
        transition={{ duration: 0.2 }}
      >
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
          }}
        >
          {tech.name}
        </span>
      </motion.div>
    </motion.div>
  );
}
