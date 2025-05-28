'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import React from 'react';

interface Section3DProps {
  children: React.ReactNode;
  title: string;
  id: string;
}

const AnimatedLetter = ({
  letter,
  index,
  shouldAnimate,
}: {
  letter: string;
  index: number;
  shouldAnimate: boolean;
}) => {
  const [randomValues, setRandomValues] = useState({ x: 0, y: 0, rotate: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setRandomValues({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      rotate: (Math.random() - 0.5) * 540,
    });
  }, []);

  if (!isClient) {
    return <span className="inline-block opacity-0">{letter === ' ' ? '\u00A0' : letter}</span>;
  }

  return (
    <motion.span
      className="inline-block"
      initial={{
        opacity: 0,
        x: randomValues.x,
        y: randomValues.y,
        rotate: randomValues.rotate,
        scale: 0,
      }}
      animate={
        shouldAnimate
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
            }
          : {}
      }
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 80,
        delay: index * 0.1,
        duration: 2,
      }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  );
};

const AnimatedTitle = ({ text }: { text: string }) => {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: '-20%' });

  return (
    <div ref={titleRef} className="overflow-visible">
      {text.split('').map((letter, index) => (
        <AnimatedLetter key={index} letter={letter} index={index} shouldAnimate={isInView} />
      ))}
    </div>
  );
};

export function Section3D({ children, title, id }: Section3DProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Title opacity - fades out as we scroll through the section
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  // Content animation - immediately visible when section starts, stays visible longer
  const contentOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);

  return (
    <section id={id} ref={ref} className="relative bg-black text-white" style={{ height: '200vh' }}>
      {/* Sticky Title */}
      <div className="sticky top-16 z-20 bg-black">
        <div className="container px-4 mx-auto">
          <motion.div
            style={{
              opacity: titleOpacity,
            }}
            className="py-8"
          >
            <h2 className="text-6xl font-bold">
              <AnimatedTitle text={title} />
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Content that sticks below the title */}
      <div className="sticky z-10 bg-black" style={{ top: 'calc(4rem + 6rem + 4rem)' }}>
        <div className="container px-4 mx-auto">
          <motion.div
            style={{
              opacity: contentOpacity,
            }}
            className="carousel-section w-full py-8"
          >
            <SlidingContent>{children}</SlidingContent>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// New component to handle sliding animations for content lines
const SlidingContent = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: '-10%' });

  // Clone children and wrap each element with sliding animation
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const isEven = index % 2 === 0;
      return (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            x: isEven ? -100 : 100,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  x: 0,
                }
              : {}
          }
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100,
            delay: index * 0.2,
            duration: 0.8,
          }}
        >
          {child}
        </motion.div>
      );
    }
    return child;
  });

  return <div ref={contentRef}>{animatedChildren}</div>;
};
