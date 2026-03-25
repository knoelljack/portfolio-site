export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5" style={{ background: '#0a0a0a' }}>
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-16 max-w-[1440px] mx-auto gap-6">
        <div
          className="font-display text-[9px] uppercase tracking-[0.3em] border-l border-[#222] pl-4"
          style={{ color: '#444444' }}
        >
          © {year} JACK KNOELL. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-10">
          <a
            href="https://github.com/knoelljack"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors"
            style={{ color: '#666666' }}
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/jackknoell/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors"
            style={{ color: '#666666' }}
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors"
            style={{ color: '#666666' }}
          >
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
