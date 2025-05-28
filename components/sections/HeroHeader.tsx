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
    scrollYProgress: any;
}) => {
    const [randomValues, setRandomValues] = useState({ x: 0, y: 0, rotate: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setRandomValues({
            x: (Math.random() - 0.5) * 1000,
            y: (Math.random() - 0.5) * 1000,
            rotate: (Math.random() - 0.5) * 720,
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

const AnimatedText = ({ text, scrollYProgress }: { text: string; scrollYProgress: any }) => {
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

    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <section
            ref={ref}
            className="h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden"
        >
            <div className="container px-4 py-32 mx-auto">
                <div className="text-center">
                    <h1 className="text-[clamp(2rem,8vw,6rem)] font-medium tracking-tight mb-8">
                        <AnimatedText text="Hi, " scrollYProgress={scrollYProgress} />
                        <AnimatedText text="I'm Jack" scrollYProgress={scrollYProgress} />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ opacity: subtitleOpacity }}
                        transition={{ duration: 1.2, delay: 2.5 }}
                        className="text-[clamp(1rem,2vw,1.4rem)] text-neutral-400 text-center mt-8 max-w-2xl mx-auto"
                    >
                        Full-stack developer crafting beautiful and functional web experiences
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
