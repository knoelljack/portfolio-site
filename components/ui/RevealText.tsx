'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function RevealText({ children, className = '', delay = 0 }: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const words = children.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}
