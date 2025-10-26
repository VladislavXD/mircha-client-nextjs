import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  const BASE_URL = "https://mirchan.site";

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/auth", "/chat", "/posts", "/user", "/settings"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
