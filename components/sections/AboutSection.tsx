'use client';

import { motion } from 'framer-motion';

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

export function AboutSection() {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-xl text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          I&apos;m a full-stack developer with expertise in modern web technologies and performance
          optimization. I specialize in building scalable React/Next.js applications, mobile apps
          with React Native, and integrating cutting-edge technologies like AI and blockchain to
          create innovative solutions that solve real-world problems.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech}
              className="bg-gray-900 p-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <h4 className="font-semibold text-sm">{tech}</h4>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gray-900 p-6 rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-4">Experience & Expertise</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Frontend Development</h4>
              <p className="text-sm">
                Expert in React, Next.js 14, TypeScript, and modern CSS frameworks. Specialized in
                performance optimization achieving sub-second load times and perfect Lighthouse
                scores.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Backend & Mobile</h4>
              <p className="text-sm">
                Full-stack development with Node.js, Java, GraphQL, and React Native. Experience
                with CarPlay/Android Auto integration and AI-driven content generation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Modern Technologies</h4>
              <p className="text-sm">
                Integration with OpenAI APIs, Solana blockchain development, headless CMS solutions,
                and automated CI/CD workflows with zero runtime errors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Client Collaboration</h4>
              <p className="text-sm">
                Direct collaboration with enterprise clients including financial institutions,
                translating complex designs into responsive applications with modular component
                systems.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
