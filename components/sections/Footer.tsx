const ELSEWHERE = [
  { label: 'GitHub', href: 'https://github.com/knoelljack' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jackknoell/' },
  { label: 'Resume', href: '/resume.pdf' },
];

export function Footer() {
  return (
    <footer className="shell pb-12 pt-8">
      <hr className="rule" />
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono">© {new Date().getFullYear()} Jack Knoell</p>
        <div className="flex gap-6">
          {ELSEWHERE.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono ulink"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
