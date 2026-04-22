import type { Metadata, Viewport } from "next";

import AboutPage from "./aboutPage";

export const metadata: Metadata = {
  metadataBase: new URL("https://mirchan.site"),
  robots: {
    index: true,
    follow: true,
  },
  title: {
    default: "О проекта | Mirchan",
    template: "%s | Mirchan",
  },
  applicationName: "Mirchan",
  alternates: { canonical: "https://mirchan.site/about" },
  openGraph: {
    type: "website",
    url: "https://mirchan.site/about",
    siteName: "Mirchan",
    title: "О проекте | Mirchan",
    description:
      "Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.",
    images: [
      {
        url: "/mirchan_logo.png",
        width: 1200,
        height: 630,
        alt: "Mirchan",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "О проекте | Mirchan",
    description:
      "Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.",
    images: ["/mirchan_logo.png"],
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

  description:
    "Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function AboutPageContainer() {
  return <AboutPage />;
}
