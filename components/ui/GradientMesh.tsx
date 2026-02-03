'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export function GradientMesh() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Violet orb - follows mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Coral orb - follows mouse with offset */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.08) 0%, transparent 70%)',
          x: smoothX,
          y: smoothY,
          translateX: '-30%',
          translateY: '-70%',
        }}
      />

      {/* Static ambient gradients */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 60%)',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255, 142, 83, 0.12) 0%, transparent 60%)',
          transform: 'translate(-20%, 20%)',
        }}
      />

      {/* Subtle mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
