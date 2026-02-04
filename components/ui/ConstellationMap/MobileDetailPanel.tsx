'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Technology } from './types';
import {
  PROFICIENCY_DESCRIPTIONS,
  ACCENT_COLORS,
  PROFICIENCY_BARS,
} from './constants';

interface MobileDetailPanelProps {
  tech: Technology | null;
  onClose: () => void;
}

export function MobileDetailPanel({ tech, onClose }: MobileDetailPanelProps) {
  const color = tech ? ACCENT_COLORS[tech.accent] : '';
  const bars = tech ? PROFICIENCY_BARS[tech.proficiency] : 0;

  return (
    <AnimatePresence>
      {tech && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40 glass-card rounded-t-2xl p-5 pb-8"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-[var(--glass-border)]" />
            </div>

            {/* Content */}
            <div className="flex items-start gap-4">
              {/* Color indicator */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}`,
                  }}
                />
              </div>

              <div className="flex-1">
                {/* Header */}
                <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
                  {tech.name}
                </h3>

                {/* Proficiency */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color }}
                  >
                    {tech.proficiency}
                  </span>
                  {/* Proficiency bars */}
                  <div className="flex gap-1 flex-1 max-w-[100px]">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-2 flex-1 rounded-full transition-colors"
                        style={{
                          backgroundColor: level <= bars ? color : 'var(--glass-border)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {PROFICIENCY_DESCRIPTIONS[tech.proficiency]}
                </p>
              </div>
            </div>

            {/* Close hint */}
            <p className="text-center text-xs text-[var(--text-muted)] mt-4">
              Tap anywhere to close
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
