'use client';

import NextTopLoader from 'nextjs-toploader';
import { Providers } from '@/src/Providers/providers';
import LayoutContent from './LayoutContent';
import NextAuthProvider from '@/providers/NextAuthProvider';
import GoogleAuthSync from '@/components/GoogleAuthSync';
import { ToastProvider } from '@heroui/react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#2299DD"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl
        showSpinner
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
      <NextAuthProvider>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <GoogleAuthSync />
          <ToastProvider/>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </NextAuthProvider>
    </>
  );
}