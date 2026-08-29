/** The detail is derivable from the href, so touch devices lose nothing. */
const ELSEWHERE = [
  { label: 'GitHub', detail: '@knoelljack', href: 'https://github.com/knoelljack' },
  { label: 'LinkedIn', detail: '/in/jackknoell', href: 'https://www.linkedin.com/in/jackknoell/' },
  { label: 'Resume', detail: 'PDF', href: '/resume.pdf' },
];

export function Footer() {
  return (
    <footer className="shell">
      <div className="indent">
        <hr className="rule" />
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono">© {new Date().getFullYear()} Jack Knoell</p>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {ELSEWHERE.map(({ label, detail, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal-row link-quiet"
              >
                {label}
                <span className="mono reveal-detail" aria-hidden="true">
                  {detail}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Texture, not a second reading of the name — hidden from the a11y
          tree so it is never announced twice. */}
      <div className="mt-14 overflow-hidden md:mt-20" aria-hidden="true">
        <p className="halftone -mb-[0.14em] select-none">jack knoell</p>
      </div>
    </footer>
  );
}
