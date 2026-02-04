import { Technology, Connection, AccentColor, ProficiencyLevel } from './types';

export const TECHNOLOGIES: Technology[] = [
  { id: 'react', name: 'React', x: 25, y: 20, size: 1.4, proficiency: 'Expert', accent: 'coral' },
  { id: 'nextjs', name: 'Next.js', x: 38, y: 32, size: 1.3, proficiency: 'Expert', accent: 'violet' },
  { id: 'typescript', name: 'TypeScript', x: 18, y: 42, size: 1.3, proficiency: 'Expert', accent: 'tangerine' },
  { id: 'tailwind', name: 'Tailwind CSS', x: 32, y: 55, size: 1.1, proficiency: 'Advanced', accent: 'coral' },
  { id: 'framer', name: 'Framer Motion', x: 12, y: 65, size: 1.0, proficiency: 'Advanced', accent: 'violet' },
  { id: 'nodejs', name: 'Node.js', x: 70, y: 25, size: 1.2, proficiency: 'Advanced', accent: 'tangerine' },
  { id: 'graphql', name: 'GraphQL', x: 82, y: 40, size: 1.0, proficiency: 'Advanced', accent: 'violet' },
  { id: 'mongodb', name: 'MongoDB', x: 75, y: 58, size: 0.9, proficiency: 'Intermediate', accent: 'coral' },
  { id: 'java', name: 'Java', x: 88, y: 70, size: 0.85, proficiency: 'Intermediate', accent: 'tangerine' },
  { id: 'reactnative', name: 'React Native', x: 28, y: 78, size: 1.1, proficiency: 'Advanced', accent: 'coral' },
  { id: 'shopify', name: 'Shopify', x: 58, y: 72, size: 0.8, proficiency: 'Intermediate', accent: 'violet' },
  { id: 'solana', name: 'Solana', x: 62, y: 88, size: 0.75, proficiency: 'Familiar', accent: 'tangerine' },
];

export const CONNECTIONS: Connection[] = [
  // React connections
  { from: 'react', to: 'nextjs' },
  { from: 'react', to: 'typescript' },
  { from: 'react', to: 'reactnative' },
  { from: 'react', to: 'framer' },
  // Next.js connections
  { from: 'nextjs', to: 'typescript' },
  { from: 'nextjs', to: 'tailwind' },
  { from: 'nextjs', to: 'nodejs' },
  { from: 'nextjs', to: 'shopify' },
  // Node.js/Backend connections
  { from: 'nodejs', to: 'graphql' },
  { from: 'graphql', to: 'mongodb' },
  // Tailwind/Framer connection
  { from: 'tailwind', to: 'framer' },
  // React Native/TypeScript connection
  { from: 'reactnative', to: 'typescript' },
  // Solana/TypeScript connection
  { from: 'solana', to: 'typescript' },
  // Java/MongoDB connection
  { from: 'java', to: 'mongodb' },
];

export const SPRING_CONFIG = {
  stiffness: 380,
  damping: 30,
};

export const ENTRANCE_EASING = [0.33, 1, 0.68, 1] as const;

export const PROFICIENCY_DESCRIPTIONS: Record<ProficiencyLevel, string> = {
  Expert: 'Deep expertise with production experience',
  Advanced: 'Strong proficiency in complex applications',
  Intermediate: 'Solid working knowledge',
  Familiar: 'Growing experience and learning',
};

export const ACCENT_COLORS: Record<AccentColor, string> = {
  coral: 'var(--accent-coral)',
  violet: 'var(--accent-violet)',
  tangerine: 'var(--accent-tangerine)',
};

export const PROFICIENCY_BARS: Record<ProficiencyLevel, number> = {
  Expert: 4,
  Advanced: 3,
  Intermediate: 2,
  Familiar: 1,
};
