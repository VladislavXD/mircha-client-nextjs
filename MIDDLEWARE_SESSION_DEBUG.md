# Middleware Session Cookie - Руководство по отладке

## Формат HTTP-only session cookie

Ваша система использует HTTP-only session cookie для хранения JWT токена с информацией о пользователе.

### Структура JWT payload

```json
{
  "userId": "123",
  "username": "admin",
  "role": "ADMIN",          // ИЛИ
  "userRole": "ADMIN",      // Поддерживаются оба варианта
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Как работает getUserRole()

Функция проверяет роль в следующем порядке:

### 1. NextAuth токен (приоритет 1)
```typescript
const nextAuthToken = await getToken({ 
  req: request, 
  secret: process.env.NEXTAUTH_SECRET 
})
if (nextAuthToken?.role) return nextAuthToken.role
```

### 2. HTTP-only session cookie (приоритет 2) ⭐ ОСНОВНОЙ
```typescript
const sessionCookie = request.cookies.get('session')?.value
if (sessionCookie) {
  const decoded = decodeJWT(sessionCookie)
  // Проверяем оба варианта: role и userRole
  if (decoded?.role) return decoded.role
  if (decoded?.userRole) return decoded.userRole
}
```

### 3. authToken cookie (приоритет 3)
```typescript
const authToken = request.cookies.get('authToken')?.value
// Аналогично session
```

### 4. Fallback token cookie (приоритет 4)
```typescript
const regularToken = request.cookies.get('token')?.value
// Аналогично session
```

## Логирование для отладки

Middleware теперь логирует каждый шаг:

```bash
[Middleware] Processing: /ru/admin
[Middleware] Public path, allow via i18n: /ru/admin  # НЕТ
[Middleware] Auth status -> session: true, nextAuth: false, token: false, authToken: false
[Middleware] Admin path check, user role: ADMIN      # getUserRole()
[Middleware] Role from session cookie (role): ADMIN  # Детали откуда взята роль
[Middleware] Admin access granted                    # Доступ разрешен
```

При отказе:
```bash
[Middleware] Role from session cookie (role): REGULAR
[Middleware] Admin path check, user role: REGULAR
[Middleware] Not admin -> redirect to /?error=access_denied
```

Если роль не найдена:
```bash
[Middleware] No role found in any token
[Middleware] Admin path check, user role: null
[Middleware] Not admin -> redirect to /?error=access_denied
```

## Проверка session cookie в DevTools

### 1. Открыть DevTools → Application → Cookies

Должна быть cookie с именем `session`:

```
Name: session
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOi... (JWT токен)
HttpOnly: ✓ (галочка)
Secure: ✓ (на production)
SameSite: Lax или Strict
```

### 2. Декодировать JWT вручную

Скопируйте значение cookie и вставьте на https://jwt.io/

Проверьте payload:
```json
{
  "userId": "your-user-id",
  "username": "admin",
  "role": "ADMIN",  // <-- Должно быть это поле!
  "iat": 1702380000,
  "exp": 1702466400
}
```

## Типичные проблемы

### Проблема 1: "No role found in any token"

**Причина**: JWT payload не содержит поле `role` или `userRole`

**Решение**: Обновите сервер, чтобы включать роль в JWT:

```typescript
// Express API - при создании токена
const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
    role: user.role,  // ⭐ Добавьте это!
  },
  process.env.SECRET_KEY,
  { expiresIn: '7d' }
)
```

### Проблема 2: Cookie не передается в middleware

**Причина**: Cookie не установлена как HTTP-only или не передается в запросе

**Решение**: Проверьте установку cookie на сервере:

```typescript
// Express API
res.cookie('session', token, {
  httpOnly: true,        // ⭐ Обязательно!
  secure: true,          // В production
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
})
```

### Проблема 3: "Admin path check, user role: null"

**Причина**: Cookie есть, но JWT не декодируется

**Решение**: 
1. Проверьте формат JWT (должен быть `xxx.yyy.zzz`)
2. Убедитесь что payload это валидный JSON
3. Проверьте логи middleware на ошибки декодирования

## Тестирование middleware

### Тест 1: Проверка наличия роли в cookie

```bash
# Получить session cookie
curl -i http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'

# Ответ должен содержать Set-Cookie с session
Set-Cookie: session=eyJhbGc...; HttpOnly; Path=/; ...
```

### Тест 2: Доступ к админке с правильной ролью

```bash
# Запрос с session cookie
curl -i http://localhost:3000/ru/admin \
  -H "Cookie: session=<ваш_токен>"

# Ожидается: 200 OK (доступ разрешен)
```

### Тест 3: Доступ к админке с неправильной ролью

```bash
# Запрос с session cookie обычного пользователя
curl -i http://localhost:3000/ru/admin \
  -H "Cookie: session=<токен_regular_пользователя>"

# Ожидается: 302 Redirect на /?error=access_denied
```

## Структура cookies в вашей системе

| Cookie Name | Тип | Содержит роль? | Приоритет |
|-------------|-----|----------------|-----------|
| `session` | HTTP-only JWT | ✅ Да (основной) | 2 |
| `nextauth.session-token` | NextAuth | ✅ Да (если NextAuth используется) | 1 |
| `authToken` | JWT | ✅ Да (новая архитектура) | 3 |
| `token` | JWT | ✅ Да (legacy) | 4 |

## Обновление документации

После подтверждения работы обновите:
- `MIDDLEWARE_ADMIN_PROTECTION.md` - добавьте секцию про session cookie
- `README.md` - укажите требования к JWT payload

---

**Дата создания**: 12 декабря 2025  
**Статус**: Активно  
**Версия middleware**: 2.1.0
