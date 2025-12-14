import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'

// Публичные пути, доступные без авторизации
const publicPaths = [
  '/',
  '/auth',
  '/favicon.ico',
  '/_next',
  '/static',
  '/images',
  '/icons',
  '/about',
  '/forum',
  '/user',
  '/search',
  '/chat',
  '/posts'
]

// i18n middleware (локали проекта)
const intlMiddleware = createIntlMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru'
})

function isPublicPath(pathname: string): boolean {
  const purePath = pathname.replace(/^\/(ru|en)(?=\/|$)/, '')
  
  // Если после удаления локали путь пустой (был /ru или /en) → это главная
  if (purePath === '' || purePath === '/') {
    return publicPaths.includes('/')
  }
  
  return publicPaths.some(path => {
    if (path === '/') return false // Уже проверили выше
    
    // Точное совпадение или начало пути
    return purePath === path || purePath.startsWith(path + '/')
  })
}

function getLocaleFromPath(pathname: string): 'ru' | 'en' | null {
  const match = pathname.match(/^\/(ru|en)(\/|$)/)
  return (match?.[1] as 'ru' | 'en') ?? null
}

function withLocale(url: string, locale: 'ru' | 'en' | null) {
  return locale ? `/${locale}${url}` : url
}

// Объединённый middleware: i18n + auth (HTTP-only session + NextAuth/jwt + fallback token)
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = getLocaleFromPath(pathname)
  console.log(`[Middleware] Processing: ${pathname}`)

  // 1) Публичные пути пропускаем через i18n
  if (isPublicPath(pathname)) {
    console.log(`[Middleware] Public path, allow via i18n: ${pathname}`)
    return intlMiddleware(request)
  }

  // 2) Статус авторизации
  const session = request.cookies.get('session')?.value // HTTP-only session (новый вариант)
  // Доп. лог для диагностики: показываем raw Cookie header и сам session value
 
  const nextAuthToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) // next-auth
  const regularToken = request.cookies.get('token')?.value // fallback token из js-cookie
  const hasAuth = !!(session || nextAuthToken || regularToken)

  console.log(
    `[Middleware] Auth status -> session: ${!!session}, nextAuth: ${!!nextAuthToken}, token: ${!!regularToken}`
  )

  // 3) Поведение на /auth (и /ru/auth)
  const isAuthPath = /^\/(ru|en)?\/?auth(\/|$)/.test(pathname)
  if (isAuthPath) {
    if (hasAuth) {
      // Авторизованы -> редирект в настройки
      const url = new URL(withLocale('/dashboard/settings', locale), request.url)
      console.log('[Middleware] Auth on /auth -> redirect to', url.toString())
      return NextResponse.redirect(url)
    }
    // Не авторизованы -> разрешаем доступ к /auth (табы и формы)
    console.log('[Middleware] No auth on /auth -> allow')
    return intlMiddleware(request)
  }

  // 4) Все остальные пути: требуем авторизацию
  if (!hasAuth) {
    const url = new URL(withLocale('/auth', locale), request.url)
    console.log('[Middleware] No auth -> redirect to', url.toString())
    return NextResponse.redirect(url)
  }

  // 5) Авторизованы -> пропускаем через i18n
  console.log(`[Middleware] Authorized, allow via i18n: ${pathname}`)
  return intlMiddleware(request)
}

// Конфигурация сопоставления путей для middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|static|trpc|.*\\..*).*)',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/auth/:path*', '/dashboard/:path*',
  ]
}


