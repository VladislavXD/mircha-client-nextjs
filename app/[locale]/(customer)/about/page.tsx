import type { Metadata, Viewport } from 'next'
import AboutPage from './aboutPage'

export const metadata: Metadata = {
	metadataBase: new URL('https://mirchan.site'),
	robots: {
		index: true,
		follow: true,
	},
	title: {
		default: 'О проекта | Mirchan',
		template: '%s | Mirchan',
	},
	applicationName: 'Mirchan',
	alternates: { canonical: 'https://mirchan.site/about' },
	openGraph: {
		type: 'website',
		url: 'https://mirchan.site/about',
		siteName: 'Mirchan',
		title: 'О проекте | Mirchan',
		description:
			'Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.',
		images: [{ url: '/images/mirchanLogo.png', width: 1200, height: 630, alt: 'Mirchan' }],
		locale: 'ru_RU',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'О проекте | Mirchan',
		description:
			'Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.',
		images: ['/images/mirchanLogo.png'],
	},	
	icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
	appleWebApp: {
    title: "Mirchan",
    statusBarStyle: "default",
  },

	description: 'Mirchan — анонимная социальная сеть для свободного самовыражения: посты, персонализация профиля, лента и чаты, анонимные форумы и многое другое.',
	
}

export const viewport: Viewport ={
	width: 'device-width',
	initialScale: 1,
	themeColor: '#000000',
}

export default function AboutPageContainer() {
	return <AboutPage />
}
