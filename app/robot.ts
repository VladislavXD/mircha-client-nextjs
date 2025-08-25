import { MetadataRoute } from "next";

export default function Robot(): MetadataRoute.Robots {
	const BASE_URL = 'https://mirchan.vercel.app'
	return {
		rules: {
			userAgent: '*',
			allow: ['/', '/about'],
			disallow: ['/auth', '/chat', '/posts', '/user', '/settings'],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	}
}