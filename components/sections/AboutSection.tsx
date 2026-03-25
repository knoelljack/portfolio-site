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
  }, []);
}

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  useRevealObserver(containerRef);

  return (
    <section
      ref={containerRef}
      className="px-8 py-16 max-w-[1440px] mx-auto border-t border-white/5"
    >
      <div className="bento-grid">
        {/* 01 // CRAFT — large 2×2 philosophy card */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 p-12 flex flex-col justify-between border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tighter mb-8 italic text-white">
              01 // CRAFT
            </h2>
            <p className="text-lg leading-relaxed font-light" style={{ color: '#c6c6c6' }}>
              I believe every interface is a built structure. Every pixel serves a purpose, and
              every interaction should feel grounded in logic. My work bridges the gap between
              precise engineering and human-centric design.
            </p>
          </div>
          <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="font-display text-[10px] uppercase tracking-widest"
                style={{ color: '#919191' }}
              >
                Experience
              </span>
              <span className="font-display font-bold tabular-nums text-white">4+ Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="font-display text-[10px] uppercase tracking-widest"
                style={{ color: '#919191' }}
              >
                Location
              </span>
              <span className="font-display font-bold italic text-white">Irvine, CA</span>
            </div>
          </div>
        </div>

        {/* View Latest Works — white CTA card */}
        <div
          className="col-span-4 md:col-span-2 row-span-1 p-12 flex flex-col justify-between text-black group cursor-pointer overflow-hidden relative reveal-box"
          style={{ background: '#ffffff' }}
          onClick={() =>
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <div className="flex justify-between items-start relative z-10">
            <ArrowUpRight className="w-12 h-12 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
            <span className="font-display text-[10px] uppercase tracking-widest opacity-50">
              Featured Gallery
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-display text-3xl font-extrabold leading-none uppercase tracking-tighter">
              View Latest
              <br />
              Works
            </h3>
            <p className="text-[10px] mt-4 uppercase tracking-[0.3em] font-bold opacity-50">
              Scroll to explore
            </p>
          </div>
          {/* Ghost watermark */}
          <div className="absolute -right-6 -bottom-6 font-display font-extrabold text-[8rem] leading-none opacity-[0.04] select-none pointer-events-none">
            WORK
          </div>
        </div>

        {/* Technical Foundation — 4×3 logo grid */}
        <div
          className="col-span-4 md:col-span-2 row-span-1 p-10 flex flex-col justify-center border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <h3
            className="font-display text-[10px] uppercase tracking-[0.3em] mb-6"
            style={{ color: '#919191' }}
          >
            Technical Foundation
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
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
            ].map(({ label, Icon }) => (
              <div
                key={label}
                className="h-14 flex items-center justify-center group hover:bg-white transition-all duration-300 cursor-crosshair border border-white/5"
                style={{ background: 'var(--surface-elevated)' }}
                title={label}
              >
                <Icon
                  size={22}
                  className="group-hover:text-black transition-colors"
                  style={{ color: '#c6c6c6' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats title card */}
        <div className="col-span-4 md:col-span-2 row-span-2 p-12 flex flex-col justify-between overflow-hidden relative border border-white/5 reveal-box bg-black">
          {/* Diagonal stripe pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 24px)',
              opacity: 0.6,
            }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <span
              className="font-display text-[10px] uppercase tracking-[0.4em]"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              02 // By The Numbers
            </span>
            <div>
              <h3 className="font-display text-4xl font-extrabold tracking-tighter text-white italic leading-tight mb-6">
                Impact &amp;
                <br />
                Scale.
              </h3>
              <p
                className="text-sm font-light leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Shipped across fintech, health, automotive, and Web3 — from enterprise platforms to
                consumer apps used daily.
              </p>
            </div>
          </div>
        </div>

        {/* Components shipped */}
        <div
          className="col-span-2 md:col-span-1 p-8 flex flex-col items-center justify-center text-center border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <span className="text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            <CountUp to={100} />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
          </span>
          <span
            className="font-display text-[9px] uppercase tracking-[0.3em]"
            style={{ color: '#919191' }}
          >
            Components Shipped
          </span>
        </div>

        {/* Fortune 500 clients */}
        <div
          className="col-span-2 md:col-span-1 p-8 flex flex-col items-center justify-center text-center border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <span className="text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            F
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>
              <CountUp to={500} />
            </span>
          </span>
          <span
            className="font-display text-[9px] uppercase tracking-[0.3em]"
            style={{ color: '#919191' }}
          >
            Enterprise Clients
          </span>
        </div>

        {/* Technologies */}
        <div
          className="col-span-2 md:col-span-1 p-8 flex flex-col items-center justify-center text-center border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <span className="text-5xl font-extrabold font-display mb-2 tabular-nums text-white">
            <CountUp to={20} />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
          </span>
          <span
            className="font-display text-[9px] uppercase tracking-[0.3em]"
            style={{ color: '#919191' }}
          >
            Technologies
          </span>
        </div>

        {/* Availability */}
        <div
          className="col-span-2 md:col-span-1 p-8 flex flex-col items-center justify-center text-center border border-white/5 reveal-box"
          style={{ background: 'var(--surface-container)' }}
        >
          <span className="text-4xl mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
            ✦
          </span>
          <span
            className="font-display text-[9px] uppercase tracking-[0.3em]"
            style={{ color: '#919191' }}
          >
            Available for Work
          </span>
        </div>
      </div>
    </section>
  );
}
