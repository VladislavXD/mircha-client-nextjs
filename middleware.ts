import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Публичные страницы, которые не требуют авторизации
const publicPaths = [
  '/auth',
  '/favicon.ico',
  '/_next',
  '/api',
  '/static',
  '/images',
  '/icons'
]

// Проверяем, является ли путь публичным
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`[Middleware] Processing: ${pathname}`)
  
  // Пропускаем публичные пути
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path, skipping: ${pathname}`)
    return NextResponse.next()
  }

  // Получаем токен из cookie
  const token = request.cookies.get('token')?.value
  console.log(`[Middleware] Token exists: ${!!token}`)

  // Если нет токена и это не публичная страница - редиректим на /auth
  if (!token) {
    console.log(`[Middleware] No token, redirecting to /auth`)
    const authUrl = new URL('/auth', request.url)
    return NextResponse.redirect(authUrl)
  }

  // Если токен есть, но пользователь на странице /auth - редиректим на главную
  if (token && pathname === '/auth') {
    console.log(`[Middleware] Has token but on /auth page, redirecting to /`)
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  console.log(`[Middleware] Allowing access to: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  // Применяем middleware ко всем путям, кроме статических файлов
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
