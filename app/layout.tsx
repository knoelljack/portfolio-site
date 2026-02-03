import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/sections/Navbar';
import { GradientMesh } from '@/components/ui/GradientMesh';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <GradientMesh />
        <div className="noise-overlay" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
