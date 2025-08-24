"use client";
import "@/src/assets/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../src/Providers/providers";
import { fontSans } from "@/src/config/fonts";
import LayoutContent from "./LayoutContent";
import NextTopLoader from "nextjs-toploader";
import Head from "next/head";
import imageUrl from '@/public/images/mirchanLogo.png'
// Убрали viewport так как client component не может экспортировать viewport



export default function RooLayout({ children }: { children: React.ReactNode }) {

  const title = "Mirchan - Анонимная социальная сеть";
  const description = "Mirchan - это анонимная социальная сеть, где вы можете делиться своими мыслями, идеями и творчеством без страха осуждения. Присоединяйтесь к нам и найдите единомышленников!";
  const url = "https://mirchan.vercel.app";
  
  return (
    <html suppressHydrationWarning lang="ru">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content={title} />
        <meta name="og:description" property="og:description" content={description} />
        <meta property="og:site_name" content="Site Name" />
        <meta property="og:url" content={`${url}`} />  
        <meta name="og:image" property="og:image" content={imageUrl.src} />  
      </Head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}


