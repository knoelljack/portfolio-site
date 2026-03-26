'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProjectCard } from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

const projects: Project[] = [
  {
    id: 1,
    title: 'Eyepromise',
    description:
      'E-commerce platform for a science-backed eye health company offering supplements and topical products.',
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'Theme Development', 'Custom Apps'],
    link: 'https://eyepromise.com/',
    logo: '/logos/eyepromise-logo.svg',
  },
  {
    id: 2,
    title: 'CareDx',
    description:
      'Corporate website for a leading transplant healthcare company providing diagnostics, pharmacy services, and digital health platforms.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'CMS'],
    link: 'https://www.caredx.com/',
    logo: '/logos/caredx-logo.svg',
  },
  {
    id: 3,
    title: 'Drive Stories',
    description:
      'Mobile-first React Native application with CarPlay/Android Auto integration and OpenAI-driven backend services.',
    technologies: [
      'React Native',
      'TypeScript',
      'CarPlay API',
      'Android Auto',
      'OpenAI API',
      'Cloudflare Workers',
    ],
    appStoreLinks: {
      apple: 'https://apps.apple.com/us/app/drive-stories/id6743227880',
    },
    logo: '/logos/drive-stories-logo.svg',
  },
  {
    id: 4,
    title: 'Northern Trust',
    description:
      'Full-stack financial platform with 45+ reusable React components, Java backend integration, and AEM CMS.',
    technologies: ['React', 'Java', 'AEM CMS', 'TypeScript', 'Component Library', 'CI/CD'],
    link: 'https://www.northerntrust.com/united-states/what-we-do/wealth-management',
    logo: '/logos/northern-trust-logo.svg',
  },
  {
    id: 5,
    title: 'Vanguard Renewables',
    description:
      'High-performance corporate website achieving perfect 100% Lighthouse score with optimized GraphQL data layer.',
    technologies: ['Next.js', 'TypeScript', 'SCSS', 'GraphQL', 'DatoCMS', 'Framer Motion'],
    link: 'https://www.vanguardrenewables.com/',
    logo: '/logos/vanguard-renewables-logo.svg',
  },
  {
    id: 6,
    title: 'Edenspiekermann',
    description:
      'Agency portfolio and marketing website with sub-second global TTFB and zero runtime errors.',
    technologies: ['Next.js', 'React', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
    link: 'https://www.edenspiekermann.com/',
    logo: '/logos/edenspiekermann-logo.svg',
  },
  {
    id: 7,
    title: 'Selby Lane',
    description:
      'Secure financial services client dashboard with JWT authentication and comprehensive portfolio management.',
    technologies: ['React', 'TypeScript', 'JWT Authentication', 'Node.js', 'AWS Lambda'],
    link: 'https://selbylane.com/',
    logo: '/logos/selby-lane-logo.svg',
  },
  {
    id: 8,
    title: 'BrdSrc',
    description:
      'Full-stack surfboard marketplace with OAuth authentication and comprehensive user profiles.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'OAuth', 'Google Analytics'],
    link: 'https://www.brdsrc.com',
    logo: '/logos/brdsrc-logo.svg',
  },
  {
    id: 9,
    title: 'Gwins NFT',
    description:
      'High-performance NFT minting site on Solana blockchain — 100 unique NFTs sold out within minutes of launch.',
    technologies: ['React', 'TypeScript', 'Solana', 'Web3.js', 'Phantom Wallet'],
    link: 'https://magiceden.us/marketplace/gwins',
  },
];

function MobileProjects() {
  return (
    <section className="bg-black monolith-border py-16">
      <div className="px-6 max-w-[1440px] mx-auto">
        <h2 className="text-section-title font-display uppercase tracking-tighter text-white mb-2">
          Selected Works
        </h2>
        <p
          className="font-display text-[10px] uppercase tracking-[0.5em] mb-12"
          style={{ color: '#919191' }}
        >
          Systems &amp; Interfaces
        </p>
        <div className="space-y-12 border-t border-white/10 pt-8">
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.appStoreLinks?.apple || project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex justify-between items-start border-l border-white/20 pl-4">
                <div>
                  <h3 className="font-display font-extrabold tracking-tighter text-white text-xl mb-1">
                    {project.title.toUpperCase()}
                  </h3>
                  <p
                    className="font-display text-[10px] uppercase tracking-widest"
                    style={{ color: '#919191' }}
                  >
                    {project.technologies.slice(0, 2).join(' / ')}
                  </p>
                </div>
                <span
                  className="font-display font-extrabold tabular-nums text-2xl"
                  style={{ color: 'rgba(255,255,255,0.1)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollDistanceRef = useRef(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    const mq = window.matchMedia('(max-width: 768px)');
    mq.addEventListener('change', checkMobile);
    return () => mq.removeEventListener('change', checkMobile);
  }, []);

  // Measure carousel scroll distance and set outer section height
  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      if (contentRef.current && sectionRef.current) {
        const dist = Math.max(0, contentRef.current.scrollWidth - window.innerWidth);
        scrollDistanceRef.current = dist;
        sectionRef.current.style.height = `${window.innerHeight + dist}px`;
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isMobile]);

  // Scroll-linked horizontal motion via sticky + useScroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, (v) => -v * scrollDistanceRef.current);
  const bgTextX = useTransform(scrollYProgress, (v) => `${v * scrollDistanceRef.current * 0.1}px`);

  if (isMobile) return <MobileProjects />;

  return (
    <section ref={sectionRef}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black monolith-border">
        {/* Ghost watermark text */}
        <motion.h2
          className="absolute font-display font-extrabold uppercase leading-none pointer-events-none select-none text-white"
          style={{
            fontSize: '15vw',
            opacity: 0.03,
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            x: bgTextX,
            whiteSpace: 'nowrap',
          }}
        >
          ARCHITECTURE
        </motion.h2>

        {/* Section title — top left */}
        <div className="absolute top-0 left-0 right-0 px-8 pt-24 z-10 pointer-events-none">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-section-title font-display uppercase tracking-tighter text-white">
              03 // Selected Works
            </h2>
            <p
              className="font-display text-[10px] uppercase tracking-[0.5em] mt-2"
              style={{ color: '#919191' }}
            >
              Systems &amp; Interfaces
            </p>
          </div>
        </div>

        {/* Horizontally scrolling content */}
        <div className="absolute inset-0 flex items-center">
          <motion.div
            ref={contentRef}
            className="flex items-center gap-10"
            style={{
              x,
              paddingLeft: 'max(2rem, calc((100vw - 1440px) / 2 + 2rem))',
              paddingRight: '8rem',
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
