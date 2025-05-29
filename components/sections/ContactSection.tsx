'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ContactMethod } from '@/lib/types';

const contactMethods: ContactMethod[] = [
  {
    icon: '📧',
    title: 'Email',
    value: 'knoelljack@gmail.com',
    description: 'Drop me a line',
  },
  {
    icon: '💼',
    title: 'LinkedIn',
    value: 'linkedin.com/in/jackknoell',
    description: "Let's connect",
  },
  {
    icon: '🐙',
    title: 'GitHub',
    value: 'github.com/yourprofile',
    description: 'Check out my code',
  },
  {
    icon: '📄',
    title: 'Resume',
    value: 'Download CV',
    description: 'View my experience',
  },
];

export function ContactSection() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showGitHubOptions, setShowGitHubOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailClick = () => {
    setShowEmailForm(true);
    setIsSubmitted(false);
  };

  const handleBackClick = () => {
    setShowEmailForm(false);
    setShowGitHubOptions(false);
    setIsSubmitted(false);
  };

  const handleResumeClick = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/resume.pdf'; // Path to your resume file in the public folder
    link.download = 'Jack_Knoell_Resume.pdf'; // Name for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/jackknoell/', '_blank');
  };

  const handleGitHubClick = () => {
    setShowGitHubOptions(true);
  };

  const handleGitHubOptionClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showEmailForm) {
    return (
      <div className="w-full">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-2">←</span>
                Back to contact options
              </button>
            </div>

            {isSubmitted ? (
              <motion.div
                className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-300">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={handleBackClick}
                  className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl mr-4">
                    📧
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Send me a message</h3>
                    <p className="text-gray-300">I'll get back to you as soon as possible</p>
                  </div>
                </div>

                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Netlify form detection */}
                  <input type="hidden" name="form-name" value="contact" />

                  {/* Honeypot field for spam protection */}
                  <div className="hidden">
                    <input name="bot-field" />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-vertical"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (showGitHubOptions) {
    return (
      <div className="w-full">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <span className="mr-2">←</span>
                Back to contact options
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl mr-4">
                  🐙
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Choose GitHub Profile</h3>
                  <p className="text-gray-300">Select which profile you'd like to visit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleGitHubOptionClick('https://github.com/knoelljack')}
                  className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Personal</h4>
                      <p className="text-gray-300 text-sm">github.com/knoelljack</p>
                      <p className="text-gray-400 text-xs">Personal projects & learning</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleGitHubOptionClick('https://github.com/jack-edenspiekermann')}
                  className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">
                      💼
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Professional</h4>
                      <p className="text-gray-300 text-sm">github.com/jack-edenspiekermann</p>
                      <p className="text-gray-400 text-xs">Work & professional projects</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((contact, idx) => (
            <motion.div
              key={contact.title}
              className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              onClick={
                contact.title === 'Email'
                  ? handleEmailClick
                  : contact.title === 'Resume'
                    ? handleResumeClick
                    : contact.title === 'LinkedIn'
                      ? handleLinkedInClick
                      : contact.title === 'GitHub'
                        ? handleGitHubClick
                        : undefined
              }
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
