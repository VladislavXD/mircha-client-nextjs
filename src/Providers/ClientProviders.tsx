"use client";

import NextTopLoader from "nextjs-toploader";

import LayoutContent from "../../app/LayoutContent";

import { Providers } from "./providers";

import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader
        crawl
        showSpinner
        color="#2299DD"
        crawlSpeed={200}
        easing="ease"
        height={3}
        initialPosition={0.08}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        speed={200}
      />
      <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
        <Toaster />
        <LayoutContent>{children}</LayoutContent>
      </Providers>
    </>
  );
}
