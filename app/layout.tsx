import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/sections/Navbar';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jack Knoell - Portfolio',
  description: 'Full-Stack Developer & Creative Technologist',
  openGraph: {
    title: 'Jack Knoell - Portfolio',
    description: 'Full-Stack Developer & Creative Technologist',
    url: 'https://jackknoell.dev',
    siteName: 'Jack Knoell Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jack Knoell - Portfolio',
    description: 'Full-Stack Developer & Creative Technologist',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className={inter.className}>
        {/* Architectural grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[100] grid-overlay"
          style={{ opacity: 0.03 }}
          aria-hidden="true"
        />
        <div className="noise-overlay" />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
