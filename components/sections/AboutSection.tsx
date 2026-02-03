'use client';

import { motion } from 'framer-motion';
import { TechCloud } from '@/components/ui/TechCloud';
import { RevealText } from '@/components/ui/RevealText';

const technologies = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'React Native',
  'GraphQL',
  'Java',
  'MongoDB',
  'Tailwind CSS',
  'Framer Motion',
  'Shopify',
  'Solana',
];

const expertiseAreas = [
  {
    title: 'Frontend Development',
    description:
      'Expert in React, Next.js 14, TypeScript, and modern CSS frameworks. Specialized in performance optimization achieving sub-second load times and perfect Lighthouse scores.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Backend & Mobile',
    description:
      'Full-stack development with Node.js, Java, GraphQL, and React Native. Experience with CarPlay/Android Auto integration and AI-driven content generation.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Modern Technologies',
    description:
      'Integration with OpenAI APIs, Solana blockchain development, headless CMS solutions, and automated CI/CD workflows with zero runtime errors.',
    gradient: 'from-coral-500 to-orange-500',
  },
  {
    title: 'Client Collaboration',
    description:
      'Direct collaboration with enterprise clients including financial institutions, translating complex designs into responsive applications with modular component systems.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export function AboutSection() {
  return (
    <div className="w-full">
      <div className="container px-4 md:px-8 mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-section-title font-display text-[var(--text-primary)] mb-4">
            About Me
          </h2>
        </motion.div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left side - Content */}
          <div>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed mb-8">
              <RevealText>
                I&apos;m a full-stack developer with expertise in modern web technologies and performance
                optimization. I specialize in building scalable React/Next.js applications, mobile
                apps with React Native, and integrating cutting-edge technologies like AI and
                blockchain to create innovative solutions that solve real-world problems.
              </RevealText>
            </p>
          </div>

          {/* Right side - Tech cloud */}
          <div className="hidden lg:block">
            <TechCloud technologies={technologies} />
          </div>
        </div>

        {/* Mobile tech grid */}
        <div className="lg:hidden mb-16">
          <div className="grid grid-cols-3 gap-3">
            {technologies.map((tech, idx) => (
              <motion.div
                key={tech}
                className="tech-tag text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expertise cards - 2x2 grid */}
        <div>
          <motion.h3
            className="text-2xl font-bold font-display text-[var(--text-primary)] mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Experience & Expertise
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-6">
            {expertiseAreas.map((area, idx) => (
              <motion.div
                key={area.title}
                className="glass-card p-6 rounded-2xl group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${area.gradient} mt-2 flex-shrink-0`}
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-2 font-display">
                      {area.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
