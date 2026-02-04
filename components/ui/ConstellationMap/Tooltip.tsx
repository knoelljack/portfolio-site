'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Technology, AccentColor } from './types';
import { PROFICIENCY_DESCRIPTIONS } from './constants';

interface TooltipProps {
  tech: Technology | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const accentColors: Record<AccentColor, string> = {
  coral: 'var(--accent-coral)',
  violet: 'var(--accent-violet)',
  tangerine: 'var(--accent-tangerine)',
};

const proficiencyBars: Record<string, number> = {
  Expert: 4,
  Advanced: 3,
  Intermediate: 2,
  Familiar: 1,
};

export function Tooltip({ tech, containerRef }: TooltipProps) {
  if (!tech) return null;

  const color = accentColors[tech.accent];
  const bars = proficiencyBars[tech.proficiency];

  // Position tooltip: above star if in lower half, below if in upper half
  const showAbove = tech.y > 40;

  // Horizontal: shift left if near right edge, shift right if near left edge
  let horizontalAlign: 'left' | 'center' | 'right' = 'center';
  if (tech.x > 70) horizontalAlign = 'right';
  if (tech.x < 30) horizontalAlign = 'left';

  const getTransformX = () => {
    switch (horizontalAlign) {
      case 'left': return '0%';
      case 'right': return '-100%';
      default: return '-50%';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${tech.x}%`,
          top: showAbove ? `calc(${tech.y}% - 24px)` : `calc(${tech.y}% + 24px)`,
          transform: `translate(${getTransformX()}, ${showAbove ? '-100%' : '0%'})`,
        }}
        initial={{ opacity: 0, scale: 0.9, y: showAbove ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: showAbove ? 10 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="glass-card rounded-xl p-4 w-[200px]"
          style={{
            borderColor: `${color}30`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="font-semibold text-[var(--text-primary)]">
              {tech.name}
            </span>
          </div>

          {/* Proficiency level */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--text-muted)]">Proficiency</span>
              <span
                className="text-xs font-medium"
                style={{ color }}
              >
                {tech.proficiency}
              </span>
            </div>
            {/* Proficiency bars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: level <= bars ? color : 'var(--glass-border)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {PROFICIENCY_DESCRIPTIONS[tech.proficiency]}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
