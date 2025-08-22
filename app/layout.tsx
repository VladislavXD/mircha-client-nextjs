"use client";
import "@/src/assets/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../src/Providers/providers";
import { fontSans } from "@/src/config/fonts";
import LayoutContent from "./LayoutContent";
import NextTopLoader from "nextjs-toploader";

// Убрали viewport так как client component не может экспортировать viewport

export default function RooLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="ru">
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


