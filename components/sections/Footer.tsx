import { FooterMark } from './FooterMark';
import { Replay } from './Replay';

/** The detail is derivable from the href, so touch devices lose nothing. */
const ELSEWHERE = [
  { label: 'GitHub', detail: '@knoelljack', href: 'https://github.com/knoelljack' },
  { label: 'LinkedIn', detail: '/in/jackknoell', href: 'https://www.linkedin.com/in/jackknoell/' },
  { label: 'Resume', detail: 'PDF', href: '/resume.pdf' },
];

export function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-row">
        <p className="t-label m-0">© {new Date().getFullYear()} Jack Knoell</p>
        <div className="footer-links">
          {ELSEWHERE.map(({ label, detail, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {label}
              <span className="t-tag" aria-hidden="true">
                {detail}
              </span>
            </a>
          ))}
        </div>
        <Replay />
      </div>

      <FooterMark />
    </footer>
  );
}
