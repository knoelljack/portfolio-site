'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Linkedin, Github, FileText, User, Briefcase, ArrowLeft, Check } from 'lucide-react';

export function ContactSection() {
  const [activeView, setActiveView] = useState<'main' | 'email' | 'github'>('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleBack(): void {
    setActiveView('main');
    setIsSubmitted(false);
  }

  function handleResumeClick(): void {
    window.open('/resume.pdf', '_blank');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formEntries: Record<string, string> = {};
    formData.forEach((value, key) => {
      formEntries[key] = value.toString();
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formEntries).toString(),
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

  // Email form view
  if (activeView === 'email') {
    return (
      <div className="w-full">
        <div className="container px-4 md:px-8 mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to contact options
            </button>

            {isSubmitted ? (
              <motion.div
                className="glass-card rounded-2xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-display text-gradient mb-3">
                  Message Sent!
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={handleBack}
                  className="btn-outline px-6 py-3 rounded-xl"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--accent-coral)] to-[var(--accent-violet)] flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
                      Send me a message
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      I&apos;ll get back to you as soon as possible
                    </p>
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
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="hidden">
                    <input name="bot-field" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="input-light w-full px-4 py-3 text-[var(--text-primary)]"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input-light w-full px-4 py-3 text-[var(--text-primary)]"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="input-light w-full px-4 py-3 text-[var(--text-primary)]"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="input-light w-full px-4 py-3 text-[var(--text-primary)] resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gradient w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

  // GitHub options view
  if (activeView === 'github') {
    return (
      <div className="w-full">
        <div className="container px-4 md:px-8 mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to contact options
            </button>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--text-primary)] flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">
                    Choose GitHub Profile
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    Select which profile you&apos;d like to visit
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <motion.a
                  href="https://github.com/knoelljack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 rounded-xl flex items-center gap-4 hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Personal</h4>
                    <p className="text-sm text-[var(--text-muted)]">github.com/knoelljack</p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://github.com/jack-at-alice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 rounded-xl flex items-center gap-4 hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Professional</h4>
                    <p className="text-sm text-[var(--text-muted)]">github.com/jack-at-alice</p>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main view - Bold centered CTA
  return (
    <div className="w-full">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Gradient background wash */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, var(--accent-violet) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Main CTA text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-title font-display mb-6">
              <span className="text-[var(--text-primary)]">Let&apos;s create</span>
              <br />
              <span className="text-gradient-animated">something great</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
              Ready to bring your ideas to life? I&apos;m always excited to work on new projects
              and collaborate with great people.
            </p>
          </motion.div>

          {/* Contact buttons */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setActiveView('email')}
              className="contact-btn contact-btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </motion.button>

            <motion.a
              href="https://www.linkedin.com/in/jackknoell/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn contact-btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </motion.a>

            <motion.button
              onClick={() => setActiveView('github')}
              className="contact-btn contact-btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </motion.button>

            <motion.button
              onClick={handleResumeClick}
              className="contact-btn contact-btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-5 h-5" />
              <span>Resume</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
