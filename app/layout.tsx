"use client";
import "@/src/assets/styles/globals.css";
import clsx from "clsx";
import { Providers } from "../src/Providers/providers";
import { fontSans } from "@/src/config/fonts";
import LayoutContent from "./LayoutContent";

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
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}


