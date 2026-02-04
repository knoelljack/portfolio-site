'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 380, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !ref.current) return;

    const element = ref.current;
    const radius = 150;
    const strength = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, x, y]);

  return (
    <motion.div style={{ x: springX, y: springY }}>
      <Link
        ref={ref}
        href={href}
        className={cn(
          'btn-gradient px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2',
          className
        )}
      >
        <motion.span
          className="inline-flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {children}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.span>
      </Link>
    </motion.div>
  );
}
