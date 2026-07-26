const links = [
  { label: 'Github', href: 'https://github.com/jack-at-alice' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jackknoell/' },
  { label: 'Resume', href: '/resume.pdf' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full px-6 md:px-10 py-10">
      <div className="glass max-w-[1440px] mx-auto !rounded-full px-7 py-5 flex flex-col md:flex-row justify-between items-center gap-5">
        <div
          className="font-display text-[12px] font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          © {year} Jack Knoell. All rights reserved.
        </div>
        <div className="flex gap-2">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/[0.07] hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
