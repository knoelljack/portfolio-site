'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { Technology, Connection, ProficiencyLevel } from './types';
import {
  PROFICIENCY_DESCRIPTIONS,
  ENTRANCE_EASING,
  ACCENT_COLORS,
  PROFICIENCY_BARS,
} from './constants';

interface MobileSkillsGridProps {
  technologies: Technology[];
  connections: Connection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const PROFICIENCY_ORDER: Record<ProficiencyLevel, number> = {
  Expert: 0,
  Advanced: 1,
  Intermediate: 2,
  Familiar: 3,
};

export function MobileSkillsGrid({
  technologies,
  connections,
  selectedId,
  onSelect,
}: MobileSkillsGridProps) {
  // Sort technologies by proficiency level (Expert first) then by name
  const sortedTechnologies = useMemo(() => {
    return [...technologies].sort((a, b) => {
      const profDiff = PROFICIENCY_ORDER[a.proficiency] - PROFICIENCY_ORDER[b.proficiency];
      if (profDiff !== 0) return profDiff;
      return a.name.localeCompare(b.name);
    });
  }, [technologies]);

  // Get connected technology names for the selected item
  const connectedTechs = useMemo(() => {
    if (!selectedId) return [];
    const connected: string[] = [];
    connections.forEach((conn) => {
      if (conn.from === selectedId) {
        const tech = technologies.find((t) => t.id === conn.to);
        if (tech) connected.push(tech.name);
      }
      if (conn.to === selectedId) {
        const tech = technologies.find((t) => t.id === conn.from);
        if (tech) connected.push(tech.name);
      }
    });
    return connected;
  }, [selectedId, connections, technologies]);

  const selectedTech = selectedId
    ? technologies.find((t) => t.id === selectedId)
    : null;

  return (
    <div className="absolute inset-0 flex flex-col p-3 overflow-hidden">
      {/* Grid of skill cards - no scroll, fits all items */}
      <div className="grid grid-cols-2 gap-2 flex-1 content-start">
        {sortedTechnologies.map((tech, index) => {
          const isSelected = selectedId === tech.id;
          const color = ACCENT_COLORS[tech.accent];
          const bars = PROFICIENCY_BARS[tech.proficiency];

          return (
            <motion.button
              key={tech.id}
              className="relative text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
                ease: ENTRANCE_EASING,
              }}
              onClick={() => onSelect(tech.id)}
            >
              <motion.div
                className="glass-card p-2.5 rounded-lg h-full"
                animate={{
                  scale: isSelected ? 1.02 : 1,
                  borderColor: isSelected ? color : 'var(--glass-border)',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                {/* Header with dot and name */}
                <div className="flex items-center gap-1.5 mb-1">
                  {/* Accent dot with glow */}
                  <motion.div
                    className="relative flex-shrink-0"
                    animate={{
                      scale: isSelected ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: isSelected
                          ? `0 0 10px ${color}, 0 0 4px ${color}`
                          : `0 0 6px ${color}80`,
                      }}
                    />
                  </motion.div>

                  {/* Tech name */}
                  <span
                    className="font-medium text-xs text-[var(--text-primary)] truncate"
                    style={{
                      color: isSelected ? color : 'var(--text-primary)',
                    }}
                  >
                    {tech.name}
                  </span>
                </div>

                {/* Proficiency bars only */}
                <div className="flex gap-0.5 max-w-[50px]">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        backgroundColor:
                          level <= bars ? color : 'var(--glass-border)',
                        opacity: level <= bars ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded detail panel - overlays bottom of grid */}
      <AnimatePresence>
        {selectedTech && (
          <motion.div
            className="absolute bottom-3 left-3 right-3 z-20 glass-card rounded-xl p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: ENTRANCE_EASING,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: ACCENT_COLORS[selectedTech.accent],
                    boxShadow: `0 0 8px ${ACCENT_COLORS[selectedTech.accent]}`,
                  }}
                />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: ACCENT_COLORS[selectedTech.accent] }}
                >
                  {selectedTech.name}
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  {selectedTech.proficiency}
                </span>
              </div>
              <button
                onClick={() => onSelect(selectedTech.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-1 -m-1"
                aria-label="Close details"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              {PROFICIENCY_DESCRIPTIONS[selectedTech.proficiency]}
            </p>

            {/* Connected technologies */}
            {connectedTechs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)]">
                  Works with:
                </span>
                {connectedTechs.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
