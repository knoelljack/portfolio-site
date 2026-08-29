import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    slug: 'northern-trust',
    title: 'Northern Trust',
    discipline: 'Wealth management platform',
    summary:
      'Full-stack financial platform with 50+ reusable React components, Java backend integration, and AEM CMS.',
    technologies: ['React', 'Java', 'AEM', 'TypeScript'],
    image: '/work/northern-trust.jpg',
    link: 'https://www.northerntrust.com/united-states/what-we-do/wealth-management',
  },
  {
    slug: 'caredx',
    title: 'CareDx',
    discipline: 'Transplant healthcare',
    summary:
      'Corporate website for a leading transplant healthcare company providing diagnostics, pharmacy services, and digital health platforms.',
    technologies: ['Next.js', 'React', 'TypeScript', 'CMS'],
    image: '/work/caredx.jpg',
    link: 'https://www.caredx.com/',
  },
  {
    slug: 'vanguard-renewables',
    title: 'Vanguard Renewables',
    discipline: 'Renewable energy',
    summary:
      'High-performance corporate website achieving perfect 100% Lighthouse score with optimized GraphQL data layer.',
    technologies: ['Next.js', 'GraphQL', 'DatoCMS', 'SCSS'],
    image: '/work/vanguard.jpg',
    link: 'https://www.vanguardrenewables.com/',
  },
  {
    slug: 'edenspiekermann',
    title: 'Edenspiekermann',
    discipline: 'Design agency',
    summary:
      'Agency portfolio and marketing website with sub-second global TTFB and zero runtime errors.',
    technologies: ['Next.js', 'DatoCMS', 'GraphQL Codegen', 'Framer Motion'],
    image: '/work/edenspiekermann.jpg',
    link: 'https://www.edenspiekermann.com/',
  },
  {
    slug: 'eyepromise',
    title: 'EyePromise',
    discipline: 'Direct-to-consumer commerce',
    summary:
      'E-commerce platform for a science-backed eye health company offering supplements and topical products.',
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'Custom apps'],
    image: '/work/eyepromise.jpg',
    link: 'https://eyepromise.com/',
  },
  {
    slug: 'selby-lane',
    title: 'Selby Lane',
    discipline: 'Private equity',
    summary:
      'Secure financial services client dashboard with JWT authentication and comprehensive portfolio management.',
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS Lambda'],
    image: '/work/selby-lane.jpg',
    link: 'https://selbylane.com/',
  },
  {
    slug: 'drive-stories',
    title: 'Drive Stories',
    discipline: 'iOS / CarPlay',
    summary:
      'Mobile-first React Native application with CarPlay/Android Auto integration and OpenAI-driven backend services.',
    technologies: ['React Native', 'CarPlay', 'OpenAI', 'Cloudflare Workers'],
    // Ships in the App Store, so there is no site to screenshot. The work
    // index raises a typographic plate instead of an empty image well.
    link: 'https://apps.apple.com/us/app/drive-stories/id6743227880',
    linkLabel: 'App Store',
  },
];
