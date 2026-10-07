import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Science_Gothic } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/sections/Nav';
import { Reel } from '@/components/reel/Reel';

const display = Science_Gothic({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  // The display face sets lines solved to fill their box exactly. A fallback
  // face has different advances, so swapping would reflow every one of them —
  // and no metric-matched fallback exists for it anyway.
  display: 'block',
  adjustFontFallback: false,
});

const grotesk = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const title = 'Jack Knoell — Portfolio';

const description =
  'Front-end engineer in Irvine, California. Interfaces and the systems behind them — Northern Trust, CareDx, Vanguard Renewables, Edenspiekermann.';

export const metadata: Metadata = {
  metadataBase: new URL('https://jackknoell.dev'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://jackknoell.dev',
    siteName: 'Jack Knoell',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: '#3a2dff',
};

/**
 * Runs before first paint, so the reel's opening frame is what the page paints
 * first rather than something that covers the page a beat later. It only ever
 * opts in: without JavaScript, under reduced motion, or on a deep link to a
 * section, the attribute is never set and the page renders as a plain page.
 */
const INTRO_GATE = `(function(){try{var q=location.search;if(/[?&]intro=0\\b/.test(q))return;if(!/[?&]intro=1\\b/.test(q)&&(matchMedia('(prefers-reduced-motion: reduce)').matches||location.hash.length>1))return;document.documentElement.setAttribute('data-intro','play')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${grotesk.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      </head>
      <body>
        <Reel />
        <div className="grid-lines" aria-hidden="true">
          <div className="shell">
            {Array.from({ length: 13 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
        <Nav />
        <main className="relative z-10">{children}</main>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
