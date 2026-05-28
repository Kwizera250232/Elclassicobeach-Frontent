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
  metadataBase: new URL('https://elclassico.umunsi.com'),
  title: {
    default: 'El Classico Beach | Luxury Rubavu Resort, Restaurant & Apartments',
    template: '%s | El Classico Beach',
  },
  description:
    'El Classico Beach Chez West is a premium Lake Kivu beach bar, restaurant, and apartment stay in Rubavu, Rwanda with dining, boat experiences, sunset nightlife, and modern hospitality.',
  keywords: [
    'Rubavu resort',
    'Lake Kivu apartments',
    'El Classico Beach',
    'El Classico Beach Chez West',
    'Rwanda beach restaurant',
    'Rubavu apartments',
    'Gisenyi restaurant',
    'Lake Kivu restaurant',
    'Rubavu beach bar',
    'Rwanda luxury beach',
  ],
  openGraph: {
    title: 'El Classico Beach | Luxury Rubavu Resort, Restaurant & Apartments',
    description:
      'A cinematic Lake Kivu destination for beach dining, drinks, boat moments, nightlife, and modern apartment stays in Rubavu, Rwanda.',
    url: 'https://elclassico.umunsi.com',
    siteName: 'El Classico Beach',
    images: [
      {
        url: 'https://res.cloudinary.com/do1zvhe3j/image/upload/v1777837390/elclassico/bar-overview/bny19igudahdbtyqh7eh.jpg',
        width: 960,
        height: 997,
        alt: 'El Classico Beach Chez West',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Classico Beach | Luxury Rubavu Resort, Restaurant & Apartments',
    description:
      'Premium Lake Kivu beach bar, restaurant, and apartment hospitality in Rubavu, Rwanda.',
    images: [
      'https://res.cloudinary.com/do1zvhe3j/image/upload/v1777837390/elclassico/bar-overview/bny19igudahdbtyqh7eh.jpg',
    ],
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
