'use client';

import { motion } from 'framer-motion';

const technologies = ['React', 'Next.js', 'TypeScript', 'Node.js'];

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
          I'm a passionate developer with expertise in modern web technologies. I love creating
          beautiful, functional, and user-friendly applications that solve real-world problems.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech}
              className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotateY: 10 }}
            >
              <h4 className="font-semibold text-lg">{tech}</h4>
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
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          <p className="text-gray-300">
            5+ years of experience building scalable web applications, working with teams to deliver
            high-quality software solutions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
