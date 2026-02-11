# Middleware - Admin Role Protection

## Обзор

Обновленный middleware теперь включает защиту админ-панели с проверкой роли пользователя.

## Основные изменения

### 1. Новые константы путей

```typescript
// Публичные пути - доступны всем
const publicPaths = ['/', '/auth', '/forum', '/user', '/search', ...]

// Приватные пути - требуют авторизации
const privatePaths = ['/dashboard', '/settings', '/profile', ...]

// Админские пути - требуют роль ADMIN
const adminPaths = ['/admin']
```

### 2. Функция декодирования JWT токена

```typescript
function decodeJWT(token: string): { role?: string } | null
```

Безопасно декодирует JWT токен для извлечения роли пользователя без проверки подписи (проверка происходит на сервере).

### 3. Функция получения роли пользователя

```typescript
async function getUserRole(request: NextRequest): Promise<string | null>
```

Проверяет роль пользователя из различных источников токенов в следующем порядке:
1. **NextAuth токен** - `nextAuthToken.role`
2. **HTTP-only session cookie** - декодирует `session` cookie
3. **Fallback token** - декодирует `token` cookie
4. **AuthToken** - декодирует `authToken` cookie (новая архитектура)

### 4. Проверка доступа к админ-панели

```typescript
if (isAdminPath(pathname)) {
  // 1. Проверка авторизации
  if (!hasAuth) {
    return NextResponse.redirect('/auth')
  }
  
  // 2. Проверка роли
  const userRole = await getUserRole(request)
  if (userRole !== 'ADMIN' && userRole !== 'admin') {
    return NextResponse.redirect('/?error=access_denied')
  }
  
  // 3. Разрешение доступа
  return intlMiddleware(request)
}
```

## Поток работы

### Запрос к `/admin/*`

```
1. Пользователь → GET /ru/admin
   ↓
2. Middleware проверяет isAdminPath() → true
   ↓
3. Проверка hasAuth
   ├─ НЕТ → redirect /ru/auth
   └─ ДА → продолжаем
   ↓
4. getUserRole() извлекает роль из токена
   ↓
5. Проверка роли
   ├─ НЕ ADMIN → redirect /ru/?error=access_denied
   └─ ADMIN → разрешить доступ через intlMiddleware
```

### Запрос к обычным путям

```
1. Пользователь → GET /ru/dashboard
   ↓
2. isPublicPath() → false
   ↓
3. isAdminPath() → false
   ↓
4. Проверка hasAuth
   ├─ НЕТ → redirect /ru/auth
   └─ ДА → разрешить доступ через intlMiddleware
```

## Поддерживаемые токены

Middleware поддерживает следующие методы аутентификации:

| Cookie/Token | Описание | Приоритет |
|--------------|----------|-----------|
| `nextAuthToken` | NextAuth.js session token | 1 |
| `session` | HTTP-only session cookie (Express API) | 2 |
| `token` | Fallback token (legacy) | 3 |
| `authToken` | Новая архитектура (features/auth) | 4 |

## Формат JWT токена

JWT токен должен содержать поле `role` в payload:

```json
{
  "userId": "123",
  "username": "admin",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Поддерживаемые роли

- `ADMIN` или `admin` - полный доступ к админ-панели
- `REGULAR` или `regular` - обычный пользователь (нет доступа к админ-панели)
- `MODERATOR` или `moderator` - модератор (устаревшая роль, удалена из системы)

## Безопасность

### ✅ Что защищено

1. **Все админские пути** (`/admin/*`) требуют авторизацию И роль ADMIN
2. **Декодирование токена** происходит только для чтения роли, проверка подписи на сервере
3. **Множественная проверка** - и авторизация, и роль
4. **Redirect на главную** при отсутствии прав с параметром `?error=access_denied`

### ⚠️ Важно

- Middleware **НЕ** проверяет подлинность JWT подписи (это делает сервер)
- Middleware только читает роль из токена для routing решений
- **Основная защита** должна быть на сервере (AdminController с `@Authorization(UserRole.ADMIN)`)
- Middleware защищает только от случайного доступа, не от атак

## Логирование

Middleware логирует все проверки для отладки:

```
[Middleware] Processing: /ru/admin
[Middleware] Auth status -> session: true, nextAuth: false, token: false, authToken: true
[Middleware] Admin path check, user role: ADMIN
[Middleware] Admin access granted
```

При отказе в доступе:

```
[Middleware] Admin path check, user role: REGULAR
[Middleware] Not admin -> redirect to /?error=access_denied
```

## Обработка ошибок на клиенте

При редиректе с `?error=access_denied` клиент может показать уведомление:

```typescript
// В главном layout или странице
const searchParams = useSearchParams()
const error = searchParams.get('error')

useEffect(() => {
  if (error === 'access_denied') {
    toast.error('У вас нет доступа к админ-панели')
  }
}, [error])
```

## Тестирование

### Тест 1: Неавторизованный пользователь

```bash
# Запрос без токена
curl http://localhost:3000/ru/admin
# Ожидаемый результат: редирект на /ru/auth
```

### Тест 2: Обычный пользователь (REGULAR)

```bash
# Запрос с токеном обычного пользователя
curl -H "Cookie: authToken=<regular_user_token>" http://localhost:3000/ru/admin
# Ожидаемый результат: редирект на /ru/?error=access_denied
```

### Тест 3: Администратор (ADMIN)

```bash
# Запрос с токеном админа
curl -H "Cookie: authToken=<admin_token>" http://localhost:3000/ru/admin
# Ожидаемый результат: доступ разрешен, страница админ-панели
```

## Связанные файлы

- `middleware.ts` - основной файл middleware
- `nestjs-server/src/admin/admin.controller.ts` - серверная защита с `@Authorization(UserRole.ADMIN)`
- `client-next/app/[locale]/(customer)/admin/adminPage.tsx` - компонент админ-панели
- `client-next/src/features/admin/hooks/useAdmin.ts` - React Query хуки для админ API

## Миграция с старой версии

### Было (только проверка авторизации):

```typescript
if (!hasAuth) {
  return NextResponse.redirect('/auth')
}
return intlMiddleware(request)
```

### Стало (проверка авторизации + роли для админа):

```typescript
// Для админских путей
if (isAdminPath(pathname)) {
  if (!hasAuth) return NextResponse.redirect('/auth')
  
  const userRole = await getUserRole(request)
  if (userRole !== 'ADMIN') {
    return NextResponse.redirect('/?error=access_denied')
  }
}

// Для обычных путей
if (!hasAuth) {
  return NextResponse.redirect('/auth')
}
return intlMiddleware(request)
```

---

**Дата обновления**: 12 декабря 2025  
**Версия**: 2.0.0  
**Статус**: ✅ Активно
