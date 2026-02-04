'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import type { Project } from '@/lib/types';

const projects: Project[] = [
  {
    id: 1,
    title: 'Eyepromise',
    description:
      'E-commerce platform for a science-backed eye health company offering supplements and topical products. Features product catalog, subscription options, and educational content for consumers seeking clinically-proven eye care solutions.',
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'Theme Development', 'Custom Apps'],
    link: 'https://eyepromise.com/',
  },
  {
    id: 2,
    title: 'CareDx',
    description:
      'Corporate website for a leading transplant healthcare company providing diagnostics, pharmacy services, and digital health platforms. Built with modern web technologies to serve both healthcare professionals and transplant patients.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'CMS'],
    link: 'https://www.caredx.com/',
  },
  {
    id: 3,
    title: 'Drive Stories',
    description:
      'Mobile-first React Native application with CarPlay/Android Auto integration. Features seamless hands-free audio streaming with offline caching and full media-browser integration. Integrated OpenAI-driven backend services for dynamic content generation, boosting personalization and user engagement.',
    technologies: [
      'React Native',
      'TypeScript',
      'CarPlay API',
      'Android Auto',
      'Audio Session Management',
      'OpenAI API',
      'Cloudflare R2',
      'Cloudflare KV',
      'Cloudflare Workers',
    ],
    comingSoon: false,
    appStoreLinks: {
      apple: 'https://apps.apple.com/us/app/drive-stories/id6743227880',
    },
  },
  {
    id: 4,
    title: 'Northern Trust Platform',
    description:
      'Full-stack financial platform with comprehensive component library. Built 45+ reusable React components with Java backend integration and AEM CMS. Collaborated directly with client teams to streamline deployment workflows.',
    technologies: [
      'React',
      'Java',
      'AEM CMS',
      'TypeScript',
      'Component Library',
      'Unit Tests',
      'CI/CD',
    ],
    link: 'https://www.northerntrust.com/united-states/what-we-do/wealth-management',
  },
  {
    id: 5,
    title: 'Vanguard Renewables Site',
    description:
      'High-performance corporate website achieving perfect 100% Lighthouse score. Features modular CMS-driven sections with optimized GraphQL data layer to eliminate over-fetching and ensure fast load times.',
    technologies: [
      'Next.js',
      'TypeScript',
      'SCSS',
      'GraphQL',
      'Performance Optimization',
      'DatoCMS',
      'Framer Motion',
    ],
    link: 'https://www.vanguardrenewables.com/',
  },
  {
    id: 6,
    title: 'Edenspiekermann Marketing Site',
    description:
      'Agency portfolio and marketing website with cutting-edge performance optimization. Achieved sub-second global TTFB with zero runtime errors and enhanced user engagement through advanced animations.',
    technologies: ['Next.js', 'React', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
    link: 'https://espi-website-2024.netlify.app/',
  },
  {
    id: 7,
    title: 'Selby Lane',
    description:
      'Secure financial services client dashboard with robust authentication system. Features JWT-based login, encrypted data transmission, and comprehensive client portfolio management tools designed for financial advisors and their clients.',
    technologies: [
      'React',
      'TypeScript',
      'JWT Authentication',
      'Node.js',
      'Mailchimp',
      'Security',
      'AWS Lambda',
    ],
    link: 'https://selbylane.com/portal',
  },
  {
    id: 8,
    title: 'BrdSrc',
    description:
      'Full-stack surfboard marketplace enabling users to buy and sell surfboards with seamless user experience. Features secure OAuth authentication, comprehensive user profiles, and robust data management. Built with modern web technologies for optimal performance and scalability.',
    technologies: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'OAuth',
      'Google Analytics',
      'Database Management',
      'Authentication',
      'E-commerce',
    ],
    link: 'https://www.brdsrc.com',
  },
  {
    id: 9,
    title: 'Gwins NFT',
    description:
      'High-performance NFT minting website for exclusive 1-of-1 digital collectibles on Solana blockchain. Implemented seamless wallet integration and optimized minting process that enabled 100 unique NFTs to sell out within minutes of launch.',
    technologies: ['React', 'TypeScript', 'Solana', 'Web3.js', 'Phantom Wallet', 'NFT Metadata'],
    link: 'https://magiceden.us/marketplace/gwins',
  },
];

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const progressWidth = useTransform(scrollXProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="w-full">
      <div className="container px-4 md:px-8 mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-section-title font-display text-[var(--text-primary)] mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            A selection of my recent work spanning web applications, mobile development, and
            creative technology solutions.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="horizontal-scroll items-stretch px-4 md:px-8 lg:px-[calc((100vw-1280px)/2+2rem)] scroll-px-4 md:scroll-px-8 lg:scroll-px-[calc((100vw-1280px)/2+2rem)]"
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="container px-4 md:px-8 mx-auto mt-8">
        <div className="max-w-xs mx-auto">
          <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent-coral)] to-[var(--accent-violet)] rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
          <p className="text-center text-sm text-[var(--text-muted)] mt-2">
            Scroll to explore projects
          </p>
        </div>
      </div>
    </div>
  );
}
