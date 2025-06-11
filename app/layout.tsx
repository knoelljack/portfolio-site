import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/sections/Navbar';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Jack Knoell - Portfolio',
  description: 'Personal portfolio showcasing my projects and skills',
  openGraph: {
    title: 'Jack Knoell - Portfolio',
    description: 'Personal portfolio showcasing my projects and skills',
    url: 'https://jackknoell.dev',
    siteName: 'Jack Knoell Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jack Knoell - Portfolio',
    description: 'Personal portfolio showcasing my projects and skills',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
