import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js + OpenAI Realtime API (WebRTC)',
  description:
    "Next.js Starter for using the OpenAI Realtime API WebRTC method. Starter showcases capabilities of OpenAI's latest Realtime API (12/17/2024). It has all shadcn/ui components to build your own real-time voice AI application. Fastest & latest way to do Voice AI (Dec 2024), implementing API advancements of Day of OpenAI's 12 days of Christmas.",
  authors: [{ name: siteConfig.author, url: siteConfig.links.twitter }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    images: '/opengraph-image.png',
  },
  icons: {
    icon: '/favicon.ico',
  },
  // keywords: [
  //   'AI Blocks',
  //   'OpenAI Blocks',
  //   'Blocks',
  //   'OpenAI Realtime API',
  //   'OpenAI Realtime',
  //   'OpenAI WebRTC',
  //   'Livekit',
  //   'OpenAI Realtime WebRTC',
  //   'OpenAI Realtime Starter',
  //   'Voice AI',
  //   'Voice AI components',
  //   'web components',
  //   'UI components',
  //   'UI Library',
  //   'shadcn',
  //   'aceternity',
  //   'AI',
  //   'Next.js',
  //   'React',
  //   'Tailwind CSS',
  //   'Framer Motion',
  //   'TypeScript',
  //   'Design engineer',
  //   'shadcn ai',
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-dvh bg-background font-sans antialiased', geistSans.variable)}>
        {children}
      </body>
    </html>
  );
}
