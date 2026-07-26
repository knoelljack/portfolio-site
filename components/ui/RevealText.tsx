'use client';

import { motion, useInView, type MotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface RevealTextViewportProps {
  mode?: 'viewport';
  children: string;
  className?: string;
  delay?: number;
}

interface RevealTextScrollProps {
  mode: 'scroll';
  scrollProgress: MotionValue<number>;
  children: string;
  className?: string;
}

type RevealTextProps = RevealTextViewportProps | RevealTextScrollProps;

function ScrollRevealWord({
  word,
  index,
  total,
  scrollProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollProgress, [start, end], [0.2, 1]);
  const y = useTransform(scrollProgress, [start, end], ['8px', '0px']);

  return (
    <span className="inline-block overflow-hidden">
      <motion.span className="inline-block" style={{ opacity, y }}>
        {word}
      </motion.span>
      {'\u00A0'}
    </span>
  );
}

function ScrollReveal({ children, className, scrollProgress }: RevealTextScrollProps) {
  const words = children.split(' ');
  return (
    <span className={className}>
      {words.map((word, index) => (
        <ScrollRevealWord
          key={index}
          word={word}
          index={index}
          total={words.length}
          scrollProgress={scrollProgress}
        />
      ))}
    </span>
  );
}

function ViewportReveal({ children, className = '', delay = 0 }: RevealTextViewportProps) {
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

/**
 * The two modes are separate components rather than branches in one, because
 * the viewport mode calls `useInView` and the scroll mode returns before it.
 * Switching `mode` on a mounted instance would change the hook order and
 * throw \u2014 splitting them means each renders a fresh component instead.
 */
export function RevealText(props: RevealTextProps) {
  return props.mode === 'scroll' ? <ScrollReveal {...props} /> : <ViewportReveal {...props} />;
}
