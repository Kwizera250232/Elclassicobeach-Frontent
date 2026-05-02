import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const headingFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
});

const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'El Classico Beach | Bar, Restaurant and Apartment Stay',
  description:
    'El Classico Beach Chez West combines bar, restaurant, nightlife, and apartment hospitality in one premium Lake Kivu destination.',
  keywords: ['bar', 'restaurant', 'apartment', 'beach club', 'Lake Kivu', 'events', 'booking'],
  openGraph: {
    title: 'El Classico Beach | Bar, Restaurant and Apartment Stay',
    description:
      'Premium dining, live events, and apartment hospitality in a standalone digital experience.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-[var(--font-body)]">{children}</body>
    </html>
  );
}
