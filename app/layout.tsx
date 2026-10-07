import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Science_Gothic } from 'next/font/google';
import './globals.css';
import { Menu } from '@/components/story/Menu';
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
  themeColor: '#ffffff',
};

/**
 * Runs before first paint, so the page paints in the layout it will keep and
 * the reel's opening frame is the first thing on screen. It only ever opts in:
 * without JavaScript or under reduced motion neither attribute is set, and the
 * page renders as a plain, stacked page.
 *
 * `data-scenes` turns the page into the scroll story. If the story's script
 * never arrives to claim it, the page drops back to the stacked layout rather
 * than leaving a stage that nothing drives. `data-intro` plays the reel, except
 * on a deep link to a section.
 */
const GATE = `(function(){try{var d=document.documentElement,q=location.search;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-scenes','');setTimeout(function(){if(!window.__story)d.removeAttribute('data-scenes')},6000);if(/[?&]intro=0\\b/.test(q))return;if(!/[?&]intro=1\\b/.test(q)&&location.hash.length>1)return;d.setAttribute('data-intro','play')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${grotesk.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: GATE }} />
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
        <Menu />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
