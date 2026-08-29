import type { Metadata } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Rail } from '@/components/sections/Rail';

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

const title = 'Jack Knoell — Product-Minded Full-Stack Engineer';

const description =
  'Full-stack engineer in Irvine, California. Interfaces, component systems and the APIs behind them — Northern Trust, CareDx, Vanguard Renewables, Edenspiekermann.';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        <Rail />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
