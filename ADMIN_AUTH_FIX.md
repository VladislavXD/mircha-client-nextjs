# Исправление: "Пользователь не авторизован" на админ-странице

## Проблема

При открытии `/admin` клиент получал ошибку:
```
Ошибка загрузки статистики: Error: Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.
```

## Причина

1. **useProfile не загружал профиль на `/admin`**  
   В `client-next/src/features/profile/hooks/useProfile.ts` путь `/admin` был в списке `publicRoots`, где профиль не запрашивается.

2. **SESSION_DOMAIN в nestjs-server/.env был установлен в `localhost`**  
   При явной установке `SESSION_DOMAIN=localhost` браузер может не отправлять куки на `localhost:4000` с клиента `localhost:3000` в некоторых конфигурациях. Правильно оставить пустым для локальной разработки, чтобы браузер использовал текущий origin.

3. **NestJS AuthGuard проверял `request.session.userId`**  
   Если сессия не передаётся, `session.userId` undefined → 401 Unauthorized.

## Исправления

### 1. Убрали `/admin` из publicRoots в useProfile ✅

**Файл:** `client-next/src/features/profile/hooks/useProfile.ts`

```diff
  const publicRoots = new Set([
    '/auth',
    '/forum',
    '/user',
    '/search',
-   '/admin'
+   // Не исключаем админку: для проверки роли нужен профиль
  ])
```

Теперь на админской странице `useCurrentUser()` → `useProfile()` → запрос к `/users/profile` с куками.

### 2. Исправили SESSION_DOMAIN в .env ✅

**Файл:** `nestjs-server/.env`

```diff
- SESSION_DOMAIN=localhost
+ SESSION_DOMAIN=  # Пусто = текущий origin, для localhost нужно оставить пустым
```

Когда `SESSION_DOMAIN` пустой, `connect-redis` и `express-session` не устанавливают атрибут `domain` в `Set-Cookie` → браузер привязывает куку к текущему origin (`localhost:4000`), и она автоматически отправляется на этот же origin при `credentials: 'include'`.

### 3. Настройки CORS уже корректны ✅

**Файл:** `nestjs-server/src/main.ts` (строки 72-76)

```typescript
app.enableCors({
  origin: config.getOrThrow<string>('ALLOWED_ORIGIN'), // 'http://localhost:3000'
  credentials: true,
  exposedHeaders: ['set-cookie']
})
```

### 4. Клиент уже использует credentials: 'include' ✅

**Файл:** `client-next/src/api/instance.api.ts`

```typescript
export const api = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL_AUTH as string,
  options: {
    credentials: 'include' // ✅ Отправляет куки
  }
})
```

## Как это работает сейчас

1. **Логин:**
   - Клиент → `POST http://localhost:4000/auth/login` (credentials: include)
   - NestJS → создаёт сессию в Redis, устанавливает `req.session.userId`
   - NestJS → отправляет `Set-Cookie: session=<sid>; HttpOnly; Path=/; SameSite=Lax`
   - Браузер → сохраняет куку `session` для `localhost:4000`

2. **Админ-страница:**
   - Клиент → открывает `/admin`
   - `adminPage.tsx` → `useCurrentUser()` → `useProfile()`
   - `useProfile()` → `GET http://localhost:4000/users/profile` (credentials: include)
   - Браузер → отправляет `Cookie: session=<sid>`
   - NestJS → `AuthGuard` читает `request.session.userId` → находит юзера → возвращает профиль с `role: "ADMIN"`
   - Клиент → получает `currentUser`, проверяет `currentUser.role === 'ADMIN'` → рендерит админку

## Проверка после исправления

### 1. Перезапустите NestJS сервер

```bash
cd nestjs-server
# Убейте текущий процесс (Ctrl+C если запущен)
yarn start:dev
```

### 2. Проверьте куку в браузере

1. Откройте DevTools (F12) → вкладка **Application**
2. Слева: **Cookies** → `http://localhost:4000`
3. Должна быть кука `session` с длинным значением (session ID)

### 3. Проверьте запрос `/users/profile`

1. Откройте DevTools → вкладка **Network**
2. Перейдите на `/admin`
3. Найдите запрос `GET /users/profile`
4. Проверьте:
   - **Request Headers** → должен быть `Cookie: session=...`
   - **Response Status** → должно быть `200 OK`
   - **Response Body** → должен содержать `{ id, email, role: "ADMIN", ... }`

## Если проблема всё ещё есть

### Симптом: Кука session не отправляется в запросах
**Решение:** Проверьте, что `SESSION_DOMAIN` пустой в `.env` и перезапустили NestJS.

### Симптом: 401 Unauthorized на `/users/profile`
**Решение:** Проверьте в Redis, есть ли сессия:
```bash
redis-cli
> KEYS sessions:*
> GET sessions:<sid>
```

### Симптом: Кука session устанавливается, но браузер её игнорирует
**Решение:** Проверьте `SameSite` и убедитесь, что:
- Клиент и сервер на одном домене (`localhost`)
- `SESSION_SECURE=false` (для HTTP в dev)
- CORS origin совпадает: `ALLOWED_ORIGIN=http://localhost:3000`

## Связанные файлы

- `nestjs-server/.env` — SESSION_DOMAIN исправлен
- `client-next/src/features/profile/hooks/useProfile.ts` — убран `/admin` из publicRoots
- `nestjs-server/src/main.ts` — CORS с credentials
- `nestjs-server/src/auth/guards/auth.guard.ts` — проверка session.userId
- `client-next/src/api/instance.api.ts` — credentials: 'include'

---

**Дата:** 12 декабря 2025  
**Статус:** ✅ Исправлено
