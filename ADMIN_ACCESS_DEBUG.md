# Отладка проблемы с доступом к админ-панели

## Проблема
При переходе на `/en/admin` происходит редирект на `/en?error=access_denied`

## Возможные причины

### 1. Session cookie не содержит роль
**Проверка**: 
1. Откройте DevTools (F12) → Application → Cookies → localhost:3000
2. Найдите cookie с именем `session` (или `authToken`, `token`)
3. Скопируйте значение и вставьте на https://jwt.io/
4. Проверьте payload - должно быть поле `role: "ADMIN"`

**Если роли нет**:
- Проблема на сервере при создании JWT токена
- Нужно обновить код, который создает токен при логине

### 2. Cookie не установлена как HTTP-only
**Проверка**:
- В DevTools → Cookies проверьте что у `session` стоит галочка в колонке `HttpOnly`

**Если галочки нет**:
- Cookie установлена как обычная (не HTTP-only)
- Next.js middleware не видит обычные cookies
- Нужно изменить сервер чтобы устанавливать `httpOnly: true`

### 3. Неправильное имя cookie
**Проверка**:
- Middleware ищет cookies: `session`, `authToken`, `token`, `nextauth.session-token`
- Проверьте что cookie называется именно так

**Если название другое**:
- Обновите middleware.ts и добавьте проверку вашего названия cookie

### 4. JWT не декодируется
**Проверка**:
- Посмотрите логи в терминале Next.js dev сервера
- Должно быть: `[Middleware] Decoded session: { userId: ..., role: ... }`

**Если ошибка декодирования**:
- JWT токен поврежден или неправильного формата
- Должен быть формат: `xxx.yyy.zzz` (3 части разделенные точкой)

## Шаги отладки

### Шаг 1: Проверить логи middleware
```bash
cd client-next
npm run dev
```

Затем откройте в браузере `/en/admin`. В терминале должны появиться логи:

```
[Middleware] Processing: /en/admin
[Middleware] 🔐 Admin path detected!
[Middleware] All cookies: session, authToken, token
[Middleware] === getUserRole START ===
[Middleware] NextAuth token: null
[Middleware] Session cookie: exists (eyJhbGciOiJIUzI1NiIsI...)
[Middleware] Decoded session: {
  "userId": "123",
  "username": "admin",
  "role": "ADMIN"  <-- ЭТО ДОЛЖНО БЫТЬ!
}
[Middleware] ✅ Role from session cookie (role): ADMIN
[Middleware] === getUserRole END ===
[Middleware] 👤 Admin path check, user role: ADMIN
[Middleware] ✅ Admin access granted
```

### Шаг 2: Если роли нет в payload

**Обновите сервер (NestJS)**:

```typescript
// nestjs-server/src/auth/auth.service.ts
async login(user: User, response: Response) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,  // ⭐ ДОБАВЬТЕ ЭТО!
  }

  const token = this.jwtService.sign(payload)

  response.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return { success: true, user }
}
```

**ИЛИ если используете Express API**:

```typescript
// express-api/routes/auth.js
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  // ... проверка пользователя
  
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,  // ⭐ ДОБАВЬТЕ ЭТО!
    },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  )

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.json({ success: true, user })
})
```

### Шаг 3: Проверить что пользователь имеет роль ADMIN

**В базе данных**:

```sql
-- PostgreSQL
SELECT id, username, email, role FROM "User" WHERE email = 'your-admin-email@test.com';

-- Должно быть:
-- id | username | email | role
-- 1  | admin    | admin@test.com | ADMIN
```

Если роль не ADMIN:

```sql
-- Обновить роль
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

### Шаг 4: Пересоздать session cookie

После обновления сервера:

1. Выйдите из системы (logout)
2. Удалите все cookies в DevTools → Application → Cookies → Clear all
3. Войдите заново
4. Проверьте новый JWT токен на jwt.io - должна быть роль

### Шаг 5: Временный обход для тестирования

Если нужно срочно протестировать админку, можно временно отключить проверку роли:

```typescript
// middleware.ts - ТОЛЬКО ДЛЯ ОТЛАДКИ!
if (isAdminPath(pathname)) {
  if (!hasAuth) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // ВРЕМЕННО: пропускаем всех авторизованных
  console.log('[Middleware] ⚠️ DEBUG MODE: Skipping role check')
  return intlMiddleware(request)
  
  // const userRole = await getUserRole(request)
  // ... остальной код
}
```

⚠️ **НЕ ЗАБУДЬТЕ ВЕРНУТЬ ПРОВЕРКУ РОЛИ ОБРАТНО!**

## Быстрая диагностика

Откройте консоль браузера (F12) и выполните:

```javascript
// Проверить текущие cookies
document.cookie.split(';').forEach(c => console.log(c.trim()))

// Проверить session cookie (если она НЕ HTTP-only - плохо!)
const sessionCookie = document.cookie.split(';').find(c => c.includes('session'))
console.log('Session cookie:', sessionCookie || 'NOT FOUND')

// Если cookie HTTP-only, вы НЕ УВИДИТЕ её здесь - это хорошо!
```

## Контрольный чек-лист

- [ ] Session cookie установлена на сервере
- [ ] Cookie имеет флаг `httpOnly: true`
- [ ] JWT payload содержит поле `role: "ADMIN"`
- [ ] Пользователь в БД имеет роль `ADMIN`
- [ ] Логи middleware показывают правильную роль
- [ ] Middleware использует правильное имя cookie

---

**Следующий шаг**: Скопируйте логи middleware из терминала и пришлите - будет видна точная причина редиректа.
