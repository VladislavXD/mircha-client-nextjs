import "@/src/assets/styles/globals.css";
import clsx from "clsx";
import { fontSans } from "@/src/config/fonts";
import type { Metadata, Viewport } from "next";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import ClientProviders from "@/shared/Providers/ClientProviders";
import { getMessages } from "next-intl/server";
import { Locale, routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";

// Важно: убедитесь, что этот файл существует: /public/images/mirchanLogo.jpg
// const siteUrl = "https://mirchan.site/ru";
// const ogImage = "/images/mirchanLogo.png";

// export const metadata: Metadata = {
//   metadataBase: new URL(siteUrl),
//   title: {
//     default: "Mirchan - Анонимная социальная сеть",
//     template: "%s | Mirchan",
//   },
//   description:
//     "Mirchan - это анонимная социальная сеть, где вы можете делиться своими мыслями, идеями и творчеством без страха осуждения.",
//   applicationName: "Mirchan",
  
//   alternates: { canonical: siteUrl },
//   openGraph: {
//     type: "website",
//     url: siteUrl,
//     siteName: "Mirchan",
//     title: "Mirchan - Аноним/*  */ная социальная сеть",
//     description:
//       "Делитесь мыслями и творчеством анонимно. Присоединяйтесь и найдите единомышленников!",
//     images: [{ url: ogImage, width: 1200, height: 630, alt: "Mirchan" }],
//     locale: "ru_RU",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Mirchan - Анонимная социальная сеть",
//     description:
//       "Делитесь мыслями и творчеством анонимно. Присоединяйтесь и найдите единомышленников!",
//     images: [ogImage],
//   },
//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
//       { url: "/favicon.svg", type: "image/svg+xml" },
//     ],
//     apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
//     shortcut: ["/favicon.ico"],
//     other: [
//       { rel: "manifest", url: "/site.webmanifest" },
//     ],
//   },

//   appleWebApp: {
//     title: "Mirchan",
//     statusBarStyle: "default",
//   },
  
  

// };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {

  const {locale} =await  params

  const messages = (await import(`@/messages/${locale}.json`)).default;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
