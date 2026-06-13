import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import createIntlMiddleware from "next-intl/middleware";

// Публичные пути, доступные без авторизации
const publicPaths = [
  "/",
  "/auth",
  "/favicon.ico",
  "/_next",
  "/static",
  "/images",
  "/icons",
  "/about",
  "/forum",
  "/user",
  "/search",
  "/chat",
  "/posts",
  "/legal",
  "/terms",
  "/privacy",
  "/activity",
  "/workspace",
];

// i18n middleware (локали проекта)
const intlMiddleware = createIntlMiddleware({
  locales: ["ru", "en"],
  defaultLocale: "ru",
});

function isPublicPath(pathname: string): boolean {
  const purePath = pathname.replace(/^\/(ru|en)(?=\/|$)/, "");

  // Если после удаления локали путь пустой (был /ru или /en) → это главная
  if (purePath === "" || purePath === "/") {
    return publicPaths.includes("/");
  }

  return publicPaths.some((path) => {
    if (path === "/") return false; // Уже проверили выше

    // Точное совпадение или начало пути
    return purePath === path || purePath.startsWith(path + "/");
  });
}

function getLocaleFromPath(pathname: string): "ru" | "en" | null {
  const match = pathname.match(/^\/(ru|en)(\/|$)/);

  return (match?.[1] as "ru" | "en") ?? null;
}

function withLocale(url: string, locale: "ru" | "en" | null) {
  return locale ? `/${locale}${url}` : url;
}

// Объединённый middleware: i18n + auth (HTTP-only session + NextAuth/jwt + fallback token)
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPath(pathname);

  if (isPublicPath(pathname)) {
    return intlMiddleware(request);
  }

  const isAuthPath = /^\/(ru|en)?\/?auth(\/|$)/.test(pathname);

  // Единственный источник истины — session cookie от Redis
  const hasAuth = !!request.cookies.get("session")?.value;

  if (isAuthPath) {
    if (hasAuth) {
      return NextResponse.redirect(new URL(withLocale("/dashboard/settings", locale), request.url));
    }
    return intlMiddleware(request);
  }

  if (!hasAuth) {
    return NextResponse.redirect(new URL(withLocale("/auth", locale), request.url));
  }

  return intlMiddleware(request);
}

// Конфигурация сопоставления путей для middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|static|trpc|.*\\..*).*)",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};
