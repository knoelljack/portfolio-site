'use client';

import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';

interface NebulaParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: 'coral' | 'violet' | 'tangerine';
  driftDuration: number;
  driftDelay: number;
}

interface NebulaBackgroundProps {
  particleCount?: number;
}

function generateParticles(count: number): NebulaParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.2,
    color: (['coral', 'violet', 'tangerine'] as const)[Math.floor(Math.random() * 3)],
    driftDuration: 20 + Math.random() * 20,
    driftDelay: Math.random() * -20,
  }));
}

export function NebulaBackground({ particleCount = 40 }: NebulaBackgroundProps) {
  const [particles, setParticles] = useState<NebulaParticle[]>([]);

  // Generate particles only on client to avoid hydration mismatch
  useEffect(() => {
    setParticles(generateParticles(particleCount));
  }, [particleCount]);

  const colorMap = {
    coral: 'var(--accent-coral)',
    violet: 'var(--accent-violet)',
    tangerine: 'var(--accent-tangerine)',
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient glow blobs */}
      <div
        className="absolute w-[40%] h-[40%] rounded-full opacity-[0.03] blur-3xl"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, var(--accent-violet) 0%, transparent 70%)',
          animation: 'nebula-drift 30s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[35%] h-[35%] rounded-full opacity-[0.03] blur-3xl"
        style={{
          right: '15%',
          top: '40%',
          background: 'radial-gradient(circle, var(--accent-coral) 0%, transparent 70%)',
          animation: 'nebula-drift 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[30%] h-[30%] rounded-full opacity-[0.02] blur-3xl"
        style={{
          left: '40%',
          bottom: '10%',
          background: 'radial-gradient(circle, var(--accent-tangerine) 0%, transparent 70%)',
          animation: 'nebula-drift 35s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />

      {/* Dust particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: colorMap[particle.color],
            opacity: particle.opacity,
            animation: `star-twinkle ${particle.driftDuration}s ease-in-out infinite`,
            animationDelay: `${particle.driftDelay}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: particle.opacity }}
          transition={{ duration: 1, delay: Math.random() * 0.5 }}
        />
      ))}
    </div>
  );
}
