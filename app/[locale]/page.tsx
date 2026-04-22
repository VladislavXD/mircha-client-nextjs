import { Metadata, Viewport } from "next";

import Posts from "../HomePage";

// Важно: убедитесь, что этот файл существует: /public/images/mirchanLogo.jpg
const siteUrl = "https://mirchan.site/ru";
const ogImage = "/mirchan_logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mirchan - Анонимная социальная сеть",
    template: "%s | Mirchan",
  },
  description:
    "Mirchan - это анонимная социальная сеть, где вы можете делиться своими мыслями, идеями и творчеством без страха осуждения.",
  applicationName: "Mirchan",

  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mirchan",
    title: "Mirchan - Аноним/*  */ная социальная сеть",
    description:
      "Делитесь мыслями и творчеством анонимно. Присоединяйтесь и найдите единомышленников!",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Mirchan" }],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirchan - Анонимная социальная сеть",
    description:
      "Делитесь мыслями и творчеством анонимно. Присоединяйтесь и найдите единомышленников!",
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon/favicon.ico"],
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },

  appleWebApp: {
    title: "Mirchan",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function Home() {
  return (
    <>
      <Posts />
    </>
  );
}
