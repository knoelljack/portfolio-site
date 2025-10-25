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
    comingSoon: false,
    appStoreLinks: {
      apple: 'https://apps.apple.com/us/app/drive-stories/id6743227880',
    },
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
    title: 'Edenspiekermann Marketing Site',
    description:
      'Agency portfolio and marketing website with cutting-edge performance optimization. Achieved sub-second global TTFB with zero runtime errors and enhanced user engagement through advanced animations.',
    technologies: ['Next.js', 'React', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
    link: 'https://espi-website-2024.netlify.app/',
  },
  {
    id: 6,
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
    id: 7,
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
              <div className="flex flex-col gap-3">
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
                {project.appStoreLinks && (
                  <div className="flex flex-wrap gap-2">
                    {project.appStoreLinks.apple && (
                      <a
                        href={project.appStoreLinks.apple}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        App Store
                      </a>
                    )}
                    {project.appStoreLinks.google && (
                      <a
                        href={project.appStoreLinks.google}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L14.54,17.53L6.72,9.71L14.5,2.17L20.16,6.31C20.66,6.61 21,7.1 21,7.68V16.29C21,16.88 20.66,17.37 20.16,17.67L14.54,12L20.16,10.81M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                        </svg>
                        Google Play
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {project.appStoreLinks && (
                  <>
                    {project.appStoreLinks.apple && (
                      <a
                        href={project.appStoreLinks.apple}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        App Store
                      </a>
                    )}
                    {project.appStoreLinks.google && (
                      <a
                        href={project.appStoreLinks.google}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L14.54,17.53L6.72,9.71L14.5,2.17L20.16,6.31C20.66,6.61 21,7.1 21,7.68V16.29C21,16.88 20.66,17.37 20.16,17.67L14.54,12L20.16,10.81M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                        </svg>
                        Google Play
                      </a>
                    )}
                  </>
                )}
                {project.link && (
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
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
