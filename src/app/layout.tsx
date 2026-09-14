import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sharair.dev'),
  title: {
    default: 'Mohammed Sharair All Mamun | High-Purity Piping Specialist',
    template: '%s | Sharair Portfolio',
  },
  description: 'High-Purity Piping Specialist & Orbital Welding QA/QC Technician with 15+ years experience in UHP gas distribution, cleanroom design, and semiconductor tool installations for world-class research facilities.',
  keywords: [
    'UHP piping',
    'orbital welding',
    'gas piping design',
    'cleanroom',
    'semiconductor',
    '316L stainless steel',
    'KAUST',
    'PipeForge',
    'BIM modeling',
    'Revit MEP',
  ],
  authors: [{ name: 'Mohammed Sharair All Mamun' }],
  creator: 'Mohammed Sharair All Mamun',
  publisher: 'Sharair Portfolio',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sharair.dev',
    siteName: 'Sharair Portfolio',
    title: 'Mohammed Sharair All Mamun | High-Purity Piping Specialist',
    description: 'High-Purity Piping Specialist & Orbital Welding QA/QC Technician with 15+ years experience in UHP gas distribution, cleanroom design, and semiconductor tool installations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sharair Portfolio - UHP Piping Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Sharair All Mamun | UHP Piping Specialist',
    description: 'High-Purity Piping Specialist & Orbital Welding QA/QC Technician',
    images: ['/og-image.jpg'],
    creator: '@mdshariaralmamun',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pipeforge.shariar.dev" />
        <link rel="dns-prefetch" href="https://api.openrouter.ai" />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}