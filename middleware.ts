import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';

const publicPaths = [
  '/auth',
  '/favicon.ico',
  '/_next',
  '/api',
  '/static',
  '/images',
  '/icons',
  '/about',
  '/forum'
];

const intlMiddleware = createIntlMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'en'
});

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing: ${pathname}`);

  // 1. Публичные пути пропускаем через i18n
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path, skipping: ${pathname}`);
    return intlMiddleware(request);
  }

  // 2. Авторизация
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const regularToken = request.cookies.get('token')?.value;
  const hasAuth = !!(nextAuthToken || regularToken);

  console.log(`[Middleware] Auth status - NextAuth: ${!!nextAuthToken}, Regular: ${!!regularToken}`);

  // --- ВАЖНОЕ ИЗМЕНЕНИЕ ---
  // Если пользователь уже на /auth (или /ru/auth), НЕ редиректим снова
  if (!hasAuth && pathname.match(/^\/(ru|en)?\/?auth/)) {
    console.log(`[Middleware] No auth, but already on /auth, allow`);
    return intlMiddleware(request);
  }

  // if (!hasAuth) {
  //   console.log(`[Middleware] No auth, redirecting to /auth`);
  //   const authUrl = new URL('/auth', request.url);
  //   return NextResponse.redirect(authUrl);
  // }

  if (hasAuth && pathname.startsWith('/auth')) {
    console.log(`[Middleware] Has auth but on /auth page, redirecting to /`);
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  console.log(`[Middleware] Allowing access to: ${pathname}`);
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|static|trpc|.*\\..*).*)',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};
