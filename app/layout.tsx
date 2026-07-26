import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/sections/Navbar';
import { AmbientField } from '@/components/ui/AmbientField';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
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
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className={inter.className}>
        {/* The light source every glass surface on the page refracts. */}
        <AmbientField />
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
