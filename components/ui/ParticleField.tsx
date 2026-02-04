'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: 'coral' | 'violet';
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.3,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * -30,
    color: Math.random() > 0.5 ? 'coral' : 'violet',
  }));
}

export function ParticleField() {
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on client to avoid hydration mismatch
  useEffect(() => {
    setParticles(generateParticles(20));
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          mouseX={smoothX}
          mouseY={smoothY}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

interface ParticleElementProps {
  particle: Particle;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  isMobile: boolean;
}

function ParticleElement({ particle, mouseX, mouseY, isMobile }: ParticleElementProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const offsetX = useSpring(0, { stiffness: 100, damping: 20 });
  const offsetY = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    if (isMobile) return;

    const unsubX = mouseX.on('change', (mx) => {
      const my = mouseY.get();
      const particleAbsX = (particle.x / 100) * window.innerWidth;
      const particleAbsY = (particle.y / 100) * window.innerHeight;

      const dx = particleAbsX - mx;
      const dy = particleAbsY - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        const angle = Math.atan2(dy, dx);
        offsetX.set(Math.cos(angle) * force * 50);
        offsetY.set(Math.sin(angle) * force * 50);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }
    });

    return () => unsubX();
  }, [isMobile, mouseX, mouseY, particle.x, particle.y, offsetX, offsetY]);

  useEffect(() => {
    const unsubX = offsetX.on('change', (x) => setOffset((prev) => ({ ...prev, x })));
    const unsubY = offsetY.on('change', (y) => setOffset((prev) => ({ ...prev, y })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [offsetX, offsetY]);

  const colorValue = particle.color === 'coral'
    ? 'var(--accent-coral)'
    : 'var(--accent-violet)';

  return (
    <div
      className="particle absolute rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        backgroundColor: colorValue,
        opacity: particle.opacity,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        animation: `particle-float ${particle.duration}s ease-in-out infinite`,
        animationDelay: `${particle.delay}s`,
      }}
    />
  );
}
