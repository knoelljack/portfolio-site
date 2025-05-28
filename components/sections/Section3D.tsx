'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface Section3DProps {
  children: React.ReactNode;
  title: string;
}

export function Section3D({ children, title }: Section3DProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Title sticky positioning - stays in place until content scrolls past
  const titleY = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, -100]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [1, 1, 0.5, 0]);

  // Content animation - appears much earlier and positioned lower
  const contentProgress = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [1, 0, -1]);

  const contentRotateX = useTransform(
    contentProgress,
    [1, 0.7, 0.3, 0, -0.3, -0.7, -1],
    [45, 25, 10, 0, -10, -25, -45]
  );

  const contentZ = useTransform(
    contentProgress,
    [1, 0.7, 0.3, 0, -0.3, -0.7, -1],
    [-400, -200, -50, 0, 50, 200, 400]
  );

  const contentY = useTransform(
    contentProgress,
    [1, 0.7, 0.3, 0, -0.3, -0.7, -1],
    [100, 50, 20, 0, -20, -50, -100]
  );

  const contentOpacity = useTransform(
    contentProgress,
    [1, 0.7, 0.2, 0, -0.2, -0.7, -1],
    [0, 0.6, 0.9, 1, 0.9, 0.6, 0]
  );

  const contentScale = useTransform(
    contentProgress,
    [1, 0.7, 0.3, 0, -0.3, -0.7, -1],
    [0.8, 0.9, 0.95, 1, 0.95, 0.9, 0.8]
  );

  return (
    <section ref={ref} className="relative bg-black text-white" style={{ height: '200vh' }}>
      {/* Sticky Title - stays in place until content scrolls past */}
      <motion.div
        style={{
          y: titleY,
          opacity: titleOpacity,
        }}
        className="sticky top-8 left-8 z-20 p-8"
      >
        <h2 className="text-6xl font-bold">{title}</h2>
      </motion.div>

      {/* Content Container - positioned lower to avoid title overlap */}
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <motion.div
          style={{
            rotateX: contentRotateX,
            z: contentZ,
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
          className="carousel-section w-full max-w-7xl px-8"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
