'use client';

import { motion } from 'framer-motion';

interface TechCloudProps {
  technologies: string[];
}

const orbitConfigs = [
  { radius: 80, duration: 20, delay: 0 },
  { radius: 120, duration: 25, delay: 2 },
  { radius: 160, duration: 30, delay: 4 },
  { radius: 100, duration: 22, delay: 1 },
  { radius: 140, duration: 28, delay: 3 },
  { radius: 90, duration: 18, delay: 5 },
  { radius: 130, duration: 24, delay: 2.5 },
  { radius: 170, duration: 32, delay: 1.5 },
  { radius: 110, duration: 26, delay: 3.5 },
  { radius: 150, duration: 29, delay: 4.5 },
  { radius: 85, duration: 21, delay: 0.5 },
  { radius: 145, duration: 27, delay: 2.8 },
];

export function TechCloud({ technologies }: TechCloudProps) {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-violet)]/20 to-[var(--accent-coral)]/20 blur-2xl" />

      {/* Orbiting tech pills */}
      {technologies.map((tech, index) => {
        const config = orbitConfigs[index % orbitConfigs.length];
        const startAngle = (index * 360) / technologies.length;

        return (
          <motion.div
            key={tech}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            style={{
              '--orbit-radius': `${config.radius}px`,
              '--orbit-duration': `${config.duration}s`,
            } as React.CSSProperties}
          >
            <motion.div
              animate={{
                rotate: [startAngle, startAngle + 360],
              }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: config.delay,
              }}
              style={{ transformOrigin: 'center center' }}
            >
              <motion.div
                className="tech-tag whitespace-nowrap shadow-sm"
                style={{
                  transform: `translateX(${config.radius}px)`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                {tech}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Center text */}
      <div className="relative z-10 text-center">
        <span className="text-4xl font-bold font-display text-gradient">12+</span>
        <p className="text-sm text-[var(--text-muted)] mt-1">Technologies</p>
      </div>
    </div>
  );
}
