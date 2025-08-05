'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const AnimatedLetter = ({
  letter,
  index,
  scrollYProgress,
}: {
  letter: string;
  index: number;
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) => {
  const [randomValues, setRandomValues] = useState({ x: 0, y: 0, rotate: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setRandomValues({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotate: (Math.random() - 0.5) * 360,
    });
  }, []);

  const x = useTransform(scrollYProgress, [0, 0.5], [0, randomValues.x]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, randomValues.y]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [0, randomValues.rotate]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      }}
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
      }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 80,
        delay: index * 0.15,
        duration: 2.5,
      }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  );
};

const AnimatedText = ({
  text,
  scrollYProgress,
}: {
  text: string;
  scrollYProgress: import('framer-motion').MotionValue<number>;
}) => {
  return (
    <div className="overflow-visible whitespace-nowrap">
      {text.split('').map((letter, index) => (
        <AnimatedLetter
          key={index}
          letter={letter}
          index={index}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
};

export function HeroHeader() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden"
    >
      <div className="container px-4 py-32 mx-auto overflow-hidden">
        <div className="text-left overflow-hidden">
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-medium tracking-tight mb-8 overflow-hidden">
            <AnimatedText text="Hi, " scrollYProgress={scrollYProgress} />
            <AnimatedText text="I'm Jack" scrollYProgress={scrollYProgress} />
          </h1>

          {/* Scroll Down Arrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 3.2 }}
            className="absolute right-8 bottom-8 md:right-16 md:bottom-16"
            style={{ pointerEvents: 'none' }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.08)" />
              <path d="M24 16V32" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M18 26L24 32L30 26"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
