import type { Metadata } from 'next';
import { Instrument_Serif, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/sections/Nav';

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
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
  'Product-minded full-stack engineer in Irvine, California. I build the interfaces brands are remembered by — Northern Trust, CareDx, Vanguard Renewables, Edenspiekermann.';

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
    <html lang="en" className={`${instrument.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <body>
        {/* Tinted by whichever project is in view. See WorkSection. */}
        <div className="wash" aria-hidden="true" />
        <Nav />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
