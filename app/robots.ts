import { MetadataRoute } from "next";

export default function Robot(): MetadataRoute.Robots {
	const BASE_URL = 'https://mirchan.site'
	return {
		rules: {
			userAgent: '*',
			allow: ['/','/en','/ru','/en/about','/ru/about'],
			disallow: ['/auth', '/chat', '/posts', '/user', '/settings'],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	}
}



