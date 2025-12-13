'use client';

import NextTopLoader from 'nextjs-toploader';
import { Providers } from './providers';
import LayoutContent from '../../app/LayoutContent';

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
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <ToastProvider/>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
    </>
  );
}