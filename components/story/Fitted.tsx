import type { Fit } from '@/lib/fit';

/**
 * Lines of display type, each solved to fill its container, each behind its
 * own mask so its letters can rise into it and leave out of the top of it.
 * The visual is hidden from assistive tech; `label` is what is read instead.
 */
export function Fitted({
  fit,
  label,
  as: Tag = 'span',
  className = '',
  id,
}: {
  fit: Fit;
  label: string;
  as?: 'span' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={`fitted ${className}`} id={id}>
      <span className="sr-only">{label}</span>
      <span
        className="fit-lines"
        style={{ '--ems': fit.ems } as React.CSSProperties}
        aria-hidden="true"
      >
        {fit.lines.map(({ text, wdth }) => (
          <span key={text} className="fit-mask">
            <span className="fit-line" style={{ '--wd': wdth } as React.CSSProperties}>
              {Array.from(text, (ch, i) => (
                <span key={i} className="ch">
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
