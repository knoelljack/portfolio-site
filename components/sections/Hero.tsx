import { projects } from '@/lib/projects';

const LINES = [
  <>I build the interfaces</>,
  <>brands are</>,
  <>
    <em>remembered by.</em>
  </>,
];

const FACTS = [
  ['Based', 'Irvine, California'],
  ['Experience', '4+ years'],
  ['Shipped', `${projects.length} products`],
];

export function Hero() {
  // Bottom-anchored on desktop, where the void above reads as gallery wall. On
  // a phone that same void is most of the screen, so the block centres instead.
  return (
    <header
      id="top"
      className="shell flex min-h-svh flex-col justify-center pb-16 pt-28 md:justify-end md:pb-20 md:pt-48"
    >
      <p className="mono fade-up" style={{ animationDelay: '0.15s' }}>
        Frontend developer
      </p>

      <h1 className="display t-hero mt-8 md:mt-10">
        {LINES.map((line, i) => (
          <span className="rise" key={i}>
            <span style={{ animationDelay: `${0.25 + i * 0.11}s` }}>{line}</span>
          </span>
        ))}
      </h1>

      <div
        className="fade-up mt-12 md:mt-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        style={{ animationDelay: '0.85s' }}
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-6">
          {FACTS.map(([label, value]) => (
            <div key={label}>
              <dt className="mono">{label}</dt>
              <dd className="mt-2 text-[0.9375rem]" style={{ color: 'var(--ink-2)' }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <a href="#work" className="btn btn-solid self-start md:self-auto">
          See the work
        </a>
      </div>
    </header>
  );
}
