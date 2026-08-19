import type { Metadata, Viewport } from 'next';
import { Oswald, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0D14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KINETIC — Next-Gen Tech Fitness Club | Akses Bebas 50+ Cabang',
  description:
    'Platform gym digital modern di Indonesia. Akses 50+ cabang dengan Dynamic QR Pass, Interactive Studio Spot Picker, dan Predictive Crowd Forecast.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KINETIC Gym',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="dark" className={`dark ${oswald.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-background text-textPrimary font-body antialiased min-h-screen flex flex-col selection:bg-volt selection:text-black">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
            <PWAInstallPrompt />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
