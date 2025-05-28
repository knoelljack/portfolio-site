'use client';

import { motion } from 'framer-motion';
import type { ContactMethod } from '@/lib/types';

const contactMethods: ContactMethod[] = [
  {
    icon: '📧',
    title: 'Email',
    value: 'your.email@example.com',
    description: 'Drop me a line',
  },
  {
    icon: '💼',
    title: 'LinkedIn',
    value: 'linkedin.com/in/yourprofile',
    description: "Let's connect",
  },
  {
    icon: '🐙',
    title: 'GitHub',
    value: 'github.com/yourprofile',
    description: 'Check out my code',
  },
  {
    icon: '🐦',
    title: 'Twitter',
    value: '@yourhandle',
    description: 'Follow my journey',
  },
];

export function ContactSection() {
  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        <motion.p
          className="text-xl text-gray-300 mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Let's get in touch! Feel free to reach out for collaborations or just to say hello.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          {contactMethods.map((contact, idx) => (
            <motion.div
              key={contact.title}
              className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl">
                  {contact.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{contact.title}</h4>
                  <p className="text-gray-300 text-sm">{contact.description}</p>
                  <p className="text-gray-400 text-xs">{contact.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
