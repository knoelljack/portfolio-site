'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiGraphql,
  SiShopify,
  SiMongodb,
  SiSolana,
  SiVercel,
  SiCloudflare,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = performance.now();

          const frame = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(frame);
          };

          requestAnimationFrame(frame);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count}</span>;
}

function useRevealObserver(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const boxes = container.querySelectorAll('.reveal-box');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.12 }
    );

    boxes.forEach((box) => observer.observe(box));
    return () => observer.disconnect();
  }, [containerRef]);
}

const STACK = [
  { label: 'React', Icon: SiReact },
  { label: 'Next.js', Icon: SiNextdotjs },
  { label: 'TypeScript', Icon: SiTypescript },
  { label: 'Node.js', Icon: SiNodedotjs },
  { label: 'Tailwind', Icon: SiTailwindcss },
  { label: 'GraphQL', Icon: SiGraphql },
  { label: 'MongoDB', Icon: SiMongodb },
  { label: 'Shopify', Icon: SiShopify },
  { label: 'Vercel', Icon: SiVercel },
  { label: 'Cloudflare', Icon: SiCloudflare },
  { label: 'Java', Icon: FaJava },
  { label: 'Solana', Icon: SiSolana },
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  useRevealObserver(containerRef);

  return (
    <section ref={containerRef} className="px-6 md:px-10 py-20 md:py-28 max-w-[1440px] mx-auto">
      <div className="bento-grid">
        {/* Craft — the philosophy panel */}
        <div className="col-span-2 row-span-2 glass glass-sheen glass-interactive reveal-box p-8 md:p-11 flex flex-col justify-between">
          <div>
            <h2 className="text-card-title mb-6 text-white">Craft</h2>
            <p
              className="text-[17px] leading-relaxed font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              I believe every interface is a built structure. Every pixel serves a purpose, and
              every interaction should feel grounded in logic. My work bridges the gap between
              precise engineering and human-centric design.
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="label">Experience</span>
              <span className="font-display font-bold tabular-nums text-white">4+ Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label">Location</span>
              <span className="font-display font-bold text-white">Irvine, CA</span>
            </div>
          </div>
        </div>

        {/* View latest works — the bright pane that replaces the old flat white card */}
        <button
          type="button"
          className="col-span-2 glass glass-sheen glass-bright glass-interactive reveal-box p-8 md:p-9 flex flex-col justify-between gap-10 text-left group cursor-pointer overflow-hidden"
          onClick={() =>
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <div className="flex justify-between items-start w-full">
            <ArrowUpRight className="w-10 h-10 text-white transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
            <span className="label">Featured Gallery</span>
          </div>
          <div className="w-full">
            <h3 className="text-card-title text-white">
              View latest
              <br />
              works
            </h3>
            <p className="label mt-3">Scroll to explore</p>
          </div>
          <span
            className="absolute -right-5 -bottom-6 font-display font-extrabold text-[5.5rem] leading-none select-none pointer-events-none text-white/[0.05]"
            aria-hidden="true"
          >
            Work
          </span>
        </button>

        {/* Technical foundation */}
        <div className="col-span-2 glass glass-sheen reveal-box p-7 md:p-9 flex flex-col justify-center">
          <h3 className="label mb-5">Technical Foundation</h3>
          <div className="grid grid-cols-6 gap-2.5">
            {STACK.map(({ label, Icon }) => (
              <div
                key={label}
                className="h-12 rounded-[14px] flex items-center justify-center transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
                title={label}
              >
                <Icon
                  size={20}
                  className="transition-colors duration-300 hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* By the numbers — the darker counterpoint panel */}
        <div className="col-span-2 row-span-2 glass glass-sheen reveal-box p-8 md:p-11 flex flex-col justify-between overflow-hidden">
          <span className="label">By the numbers</span>
          <div>
            <h3 className="text-card-title text-white mb-5">
              Impact &amp;
              <br />
              scale.
            </h3>
            <p
              className="text-[15px] font-light leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Shipped across fintech, health, automotive, and Web3 — from enterprise platforms to
              consumer apps used daily.
            </p>
          </div>
          {/* A soft bloom in the corner so this panel catches more of the field */}
          <span
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle, rgb(var(--aura-violet) / 0.3) 0%, transparent 68%)',
            }}
          />
        </div>

        {/* Stats */}
        <div className="col-span-1 glass glass-sheen reveal-box p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            <CountUp to={100} />
            <span className="text-white/25">+</span>
          </span>
          <span className="label text-center leading-snug">Components Shipped</span>
        </div>

        <div className="col-span-1 glass glass-sheen reveal-box p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            F
            <span className="text-white/25">
              <CountUp to={500} />
            </span>
          </span>
          <span className="label text-center leading-snug">Enterprise Clients</span>
        </div>

        <div className="col-span-1 glass glass-sheen reveal-box p-6 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            <CountUp to={20} />
            <span className="text-white/25">+</span>
          </span>
          <span className="label text-center leading-snug">Technologies</span>
        </div>

        <div className="col-span-1 glass glass-sheen reveal-box p-6 flex flex-col items-center justify-center text-center">
          <span className="relative flex h-2.5 w-2.5 mb-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </span>
          <span className="label text-center leading-snug">Available for Work</span>
        </div>
      </div>
    </section>
  );
}
