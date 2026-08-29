import { ArrowRight, ArrowUpRight } from 'lucide-react';

const STACK = [
  ['Languages', ['TypeScript', 'JavaScript', 'SQL', 'Liquid']],
  ['Frameworks', ['React', 'Next.js', 'React Native', 'Node.js']],
  ['Styling', ['Tailwind', 'Sass', 'CSS', 'Figma']],
  ['Data', ['GraphQL', 'Contentful', 'DatoCMS', 'AEM', 'MongoDB']],
  ['Testing', ['Vitest', 'Storybook', 'GitHub Actions']],
  ['Platform', ['Vercel', 'Cloudflare Workers', 'Shopify']],
] as const;

export function AboutSection() {
  return (
    <section id="about" className="shell">
      <div className="indent pb-20 md:pb-28">
        <hr className="rule" />
        <p className="mono mt-7">About</p>

        <div className="mt-8 grid gap-12 md:mt-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <h2 className="t-lead duo max-w-[30ch]">
              <b>One person across the stack.</b> Component architecture and CMS modeling through to
              the serverless APIs behind them.
            </h2>

            <p className="body mt-6 max-w-[48ch]">
              Shipped in fintech, healthcare, energy, automotive, and commerce — enterprise
              platforms behind a login, consumer apps used daily. Always alongside designers,
              stakeholders, and content teams.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Resume
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
                <ArrowRight className="nudge h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <dl className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 md:grid-cols-1">
              {STACK.map(([group, items]) => (
                <div key={group} className="bg-[var(--paper)] p-4">
                  <dt className="mono">{group}</dt>
                  <dd className="mt-2 text-[0.875rem] text-[var(--ink-2)]">{items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
