import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Публичные страницы, которые не требуют авторизации
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
]

// Проверяем, является ли путь публичным
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`[Middleware] Processing: ${pathname}`)
  
  // Пропускаем публичные пути
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path, skipping: ${pathname}`)
    return NextResponse.next()
  }

  // Проверяем NextAuth токен
  const nextAuthToken = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Получаем обычный токен из cookie (для обратной совместимости)
  const regularToken = request.cookies.get('token')?.value
  
  const hasAuth = !!(nextAuthToken || regularToken)
  console.log(`[Middleware] Auth status - NextAuth: ${!!nextAuthToken}, Regular: ${!!regularToken}`)

  // Если нет авторизации и это не публичная страница - редиректим на /auth
  if (!hasAuth) {
    console.log(`[Middleware] No auth, redirecting to /auth`)
    const authUrl = new URL('/auth', request.url)
    return NextResponse.redirect(authUrl)
  }

  // Если есть авторизация, но пользователь на странице /auth - редиректим на главную
  if (hasAuth && pathname === '/auth') {
    console.log(`[Middleware] Has auth but on /auth page, redirecting to /`)
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  console.log(`[Middleware] Allowing access to: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
