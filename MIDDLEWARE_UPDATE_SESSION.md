# Обновление getUserRole для работы с HTTP-only session cookie

## Что изменилось

### До обновления
- `getUserRole()` проверяла только поле `role` в JWT payload
- Логирование отсутствовало
- Неясно откуда берется роль при отладке

### После обновления ✅

#### 1. Поддержка двух форматов роли
```typescript
if (decoded?.role) return decoded.role       // Вариант 1
if (decoded?.userRole) return decoded.userRole // Вариант 2
```

Теперь middleware корректно работает независимо от того, как сервер называет поле с ролью:
- `{ role: "ADMIN" }` ✅
- `{ userRole: "ADMIN" }` ✅

#### 2. Детальное логирование
```typescript
console.log('[Middleware] Role from session cookie (role):', decoded.role)
console.log('[Middleware] Role from authToken (userRole):', decoded.userRole)
console.log('[Middleware] No role found in any token')
```

Теперь легко отследить:
- Откуда берется роль (session, authToken, token, nextAuth)
- Какое поле использовано (role или userRole)
- Почему роль не найдена

#### 3. Обновленный приоритет проверки

1. **NextAuth** → `nextAuthToken.role`
2. **HTTP-only session** → `session cookie` → `decoded.role` или `decoded.userRole` ⭐ ОСНОВНОЙ
3. **authToken** → `authToken cookie` → `decoded.role` или `decoded.userRole`
4. **Fallback token** → `token cookie` → `decoded.role` или `decoded.userRole`

## Как это работает с вашей системой

### Ваша текущая архитектура
```typescript
// В вашем коде (например, login)
const { url, cookies } = request

// Сервер устанавливает HTTP-only cookie
cookies.set('session', jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
})
```

### Middleware автоматически извлекает роль
```typescript
// middleware.ts
const sessionCookie = request.cookies.get('session')?.value
const decoded = decodeJWT(sessionCookie)
const role = decoded?.role || decoded?.userRole
```

## Примеры логов

### Успешный доступ админа
```bash
[Middleware] Processing: /ru/admin
[Middleware] Auth status -> session: true, nextAuth: false, token: false, authToken: false
[Middleware] Role from session cookie (role): ADMIN
[Middleware] Admin path check, user role: ADMIN
[Middleware] Admin access granted
```

### Отказ обычному пользователю
```bash
[Middleware] Processing: /ru/admin
[Middleware] Auth status -> session: true, nextAuth: false, token: false, authToken: false
[Middleware] Role from session cookie (role): REGULAR
[Middleware] Admin path check, user role: REGULAR
[Middleware] Not admin -> redirect to /?error=access_denied
```

### Роль не найдена
```bash
[Middleware] Processing: /ru/admin
[Middleware] Auth status -> session: true, nextAuth: false, token: false, authToken: false
[Middleware] No role found in any token
[Middleware] Admin path check, user role: null
[Middleware] Not admin -> redirect to /?error=access_denied
```

## Требования к JWT payload на сервере

Убедитесь, что ваш сервер включает роль в JWT при создании токена:

### Express API пример
```typescript
const jwt = require('jsonwebtoken')

// При логине или регистрации
const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,        // ⭐ ОБЯЗАТЕЛЬНО!
    // ИЛИ
    userRole: user.role,    // Альтернативное название
  },
  process.env.SECRET_KEY,
  { expiresIn: '7d' }
)

// Установка HTTP-only cookie
res.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
})
```

### NestJS пример
```typescript
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: User, response: Response) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,  // ⭐ ОБЯЗАТЕЛЬНО!
    }

    const token = this.jwtService.sign(payload)

    response.cookie('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { success: true }
  }
}
```

## Проверка работоспособности

### 1. Проверить наличие session cookie
```bash
# DevTools → Application → Cookies → localhost:3000
# Найти cookie 'session'
# Скопировать значение и декодировать на jwt.io
```

### 2. Проверить payload JWT
```json
{
  "userId": "...",
  "username": "...",
  "role": "ADMIN",  // <-- Должно присутствовать!
  "iat": 1702380000,
  "exp": 1702466400
}
```

### 3. Проверить логи middleware
```bash
# Запустить Next.js в dev режиме
npm run dev

# Открыть /ru/admin в браузере
# Проверить консоль терминала на наличие логов
```

## Связанные файлы

- `middleware.ts` - обновленная логика getUserRole
- `MIDDLEWARE_SESSION_DEBUG.md` - детальное руководство по отладке
- `MIDDLEWARE_ADMIN_PROTECTION.md` - общая документация по защите админки

## Следующие шаги

1. ✅ Убедиться что сервер включает роль в JWT
2. ✅ Протестировать доступ к `/admin` с разными ролями
3. ✅ Проверить логи middleware для отладки
4. ⏳ Обновить клиентский код для обработки `?error=access_denied`

---

**Дата**: 12 декабря 2025  
**Версия**: 2.1.0  
**Статус**: ✅ Готово к тестированию
