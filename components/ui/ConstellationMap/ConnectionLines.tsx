'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Technology, Connection, AccentColor } from './types';
import { ENTRANCE_EASING } from './constants';

interface ConnectionLinesProps {
  technologies: Technology[];
  connections: Connection[];
  hoveredId: string | null;
  selectedId: string | null;
}

const accentColors: Record<AccentColor, string> = {
  coral: 'var(--accent-coral)',
  violet: 'var(--accent-violet)',
  tangerine: 'var(--accent-tangerine)',
};

export function ConnectionLines({
  technologies,
  connections,
  hoveredId,
  selectedId,
}: ConnectionLinesProps) {
  const techMap = useMemo(() => {
    return new Map(technologies.map((t) => [t.id, t]));
  }, [technologies]);

  // Find connections for hovered/selected star
  const activeId = hoveredId || selectedId;
  const activeConnections = useMemo(() => {
    if (!activeId) return new Set<string>();

    const connected = new Set<string>();
    connections.forEach((conn) => {
      if (conn.from === activeId || conn.to === activeId) {
        connected.add(`${conn.from}-${conn.to}`);
      }
    });
    return connected;
  }, [activeId, connections]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Gradient definitions for each accent color combination */}
        <linearGradient id="gradient-coral-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-coral)" />
          <stop offset="100%" stopColor="var(--accent-violet)" />
        </linearGradient>
        <linearGradient id="gradient-coral-tangerine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-coral)" />
          <stop offset="100%" stopColor="var(--accent-tangerine)" />
        </linearGradient>
        <linearGradient id="gradient-violet-tangerine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-violet)" />
          <stop offset="100%" stopColor="var(--accent-tangerine)" />
        </linearGradient>
        <linearGradient id="gradient-violet-coral" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-violet)" />
          <stop offset="100%" stopColor="var(--accent-coral)" />
        </linearGradient>
        <linearGradient id="gradient-tangerine-coral" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-tangerine)" />
          <stop offset="100%" stopColor="var(--accent-coral)" />
        </linearGradient>
        <linearGradient id="gradient-tangerine-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-tangerine)" />
          <stop offset="100%" stopColor="var(--accent-violet)" />
        </linearGradient>
        {/* Same color gradients */}
        <linearGradient id="gradient-coral-coral" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-coral)" />
          <stop offset="100%" stopColor="var(--accent-coral)" />
        </linearGradient>
        <linearGradient id="gradient-violet-violet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-violet)" />
          <stop offset="100%" stopColor="var(--accent-violet)" />
        </linearGradient>
        <linearGradient id="gradient-tangerine-tangerine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-tangerine)" />
          <stop offset="100%" stopColor="var(--accent-tangerine)" />
        </linearGradient>
      </defs>

      {connections.map((conn, index) => {
        const fromTech = techMap.get(conn.from);
        const toTech = techMap.get(conn.to);

        if (!fromTech || !toTech) return null;

        const connectionKey = `${conn.from}-${conn.to}`;
        const isActive = activeConnections.has(connectionKey);
        const gradientId = `gradient-${fromTech.accent}-${toTech.accent}`;

        return (
          <ConnectionLine
            key={connectionKey}
            from={fromTech}
            to={toTech}
            gradientId={gradientId}
            isActive={isActive}
            hasActiveSelection={!!activeId}
            index={index}
          />
        );
      })}
    </svg>
  );
}

interface ConnectionLineProps {
  from: Technology;
  to: Technology;
  gradientId: string;
  isActive: boolean;
  hasActiveSelection: boolean;
  index: number;
}

function ConnectionLine({
  from,
  to,
  gradientId,
  isActive,
  hasActiveSelection,
  index,
}: ConnectionLineProps) {
  // Calculate opacity based on state
  const opacity = isActive ? 0.8 : hasActiveSelection ? 0.05 : 0.15;
  const strokeWidth = isActive ? 2 : 1;

  return (
    <motion.line
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke={`url(#${gradientId})`}
      strokeLinecap="round"
      initial={{
        pathLength: 0,
        opacity: 0,
      }}
      animate={{
        pathLength: 1,
        opacity,
        strokeWidth,
      }}
      transition={{
        pathLength: {
          duration: 0.8,
          delay: 0.5 + index * 0.05,
          ease: ENTRANCE_EASING,
        },
        opacity: {
          duration: 0.3,
        },
        strokeWidth: {
          duration: 0.2,
        },
      }}
    />
  );
}
