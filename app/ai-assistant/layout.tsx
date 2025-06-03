import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { TranslationsProvider } from '@/components/translations-context';
import { Banner } from '@/components/banner';

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
  keywords: [
    'AI Blocks',
    'OpenAI Blocks',
    'Blocks',
    'OpenAI Realtime API',
    'OpenAI Realtime',
    'OpenAI WebRTC',
    'Livekit',
    'OpenAI Realtime WebRTC',
    'OpenAI Realtime Starter',
    'Voice AI',
    'Voice AI components',
    'web components',
    'UI components',
    'UI Library',
    'shadcn',
    'aceternity',
    'AI',
    'Next.js',
    'React',
    'Tailwind CSS',
    'Framer Motion',
    'TypeScript',
    'Design engineer',
    'shadcn ai',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-dvh bg-background font-sans antialiased', geistSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <TranslationsProvider>
            <div>
              <div className='z-[100] mx-auto flex !aspect-[1046/564] h-full max-h-[80%] w-[90%] min-w-[1000px] max-w-[1500px] flex-col justify-start p-10'>
                {/* {IS_DEBUG && <Debugger currentTrackId={currentTrackId} />} */}
                {/* </div>
            <div className="relative flex min-h-dvh flex-col bg-background items-center">
              {/* <Header />
              <Banner /> */}
                {/* <main className="flex flex-1 w-full justify-center items-start"> */}
                {children}
                {/* </main> */}
                {/* </div> */}
              </div>
            </div>
            <Toaster />
          </TranslationsProvider>
        </ThemeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
