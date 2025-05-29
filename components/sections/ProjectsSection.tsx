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
      'react-native-track-player',
      'OpenAI API',
    ],
  },
  {
    id: 2,
    title: 'Northern Trust Platform',
    description:
      'Full-stack financial platform with comprehensive component library. Built 45+ reusable React components with Java backend integration and AEM CMS. Collaborated directly with client teams to streamline deployment workflows.',
    technologies: ['React', 'Java', 'AEM CMS', 'TypeScript', 'Component Library'],
  },
  {
    id: 3,
    title: 'Vanguard Renewables Site',
    description:
      'High-performance corporate website achieving perfect 100% Lighthouse score. Features modular CMS-driven sections with optimized GraphQL data layer to eliminate over-fetching and ensure fast load times.',
    technologies: ['Next.js 13', 'TypeScript', 'SCSS', 'GraphQL', 'Performance Optimization'],
  },
  {
    id: 4,
    title: 'Edenspiekermann Marketing Site',
    description:
      'Agency portfolio and marketing website with cutting-edge performance optimization. Achieved sub-second global TTFB with zero runtime errors and enhanced user engagement through advanced animations.',
    technologies: ['Next.js 14', 'React 18', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
  },
  {
    id: 5,
    title: 'Selby Lane',
    description:
      'Secure financial services client dashboard with robust authentication system. Features JWT-based login, encrypted data transmission, and comprehensive client portfolio management tools designed for financial advisors and their clients.',
    technologies: ['React', 'TypeScript', 'JWT Authentication', 'Node.js', 'Mailchimp', 'Security'],
  },
  {
    id: 6,
    title: 'Gwins NFT',
    description:
      'High-performance NFT minting website for exclusive 1-of-1 digital collectibles on Solana blockchain. Implemented seamless wallet integration and optimized minting process that enabled 100 unique NFTs to sell out within minutes of launch.',
    technologies: ['React', 'TypeScript', 'Solana', 'Web3.js', 'Phantom Wallet', 'NFT Metadata'],
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
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
