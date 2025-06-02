'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/types';

const projects: Project[] = [
  {
    id: 1,
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
    comingSoon: true,
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
    title: 'Edenspiekermann Marketing Site',
    description:
      'Agency portfolio and marketing website with cutting-edge performance optimization. Achieved sub-second global TTFB with zero runtime errors and enhanced user engagement through advanced animations.',
    technologies: ['Next.js', 'React', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
    link: 'https://espi-website-2024.netlify.app/',
  },
  {
    id: 5,
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
    id: 6,
    title: 'Gwins NFT',
    description:
      'High-performance NFT minting website for exclusive 1-of-1 digital collectibles on Solana blockchain. Implemented seamless wallet integration and optimized minting process that enabled 100 unique NFTs to sell out within minutes of launch.',
    technologies: ['React', 'TypeScript', 'Solana', 'Web3.js', 'Phantom Wallet', 'NFT Metadata'],
    link: 'https://magiceden.us/marketplace/gwins',
  },
];

export function ProjectsSection() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
            {project.comingSoon ? (
              <div className="flex gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium">
                  Coming Soon
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
            ) : project.link ? (
              <div className="flex gap-3">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                >
                  View Live Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
