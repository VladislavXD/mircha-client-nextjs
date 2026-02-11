# Исправление admin.service.ts для HTTP-only session cookie

## Проблема

Все fetch-запросы в `admin.service.ts` пытались читать токен из `Cookies.get('authToken')`, который:
1. Не существует (у вас HTTP-only cookie `session`)
2. Не может быть прочитан через JavaScript (HTTP-only флаг)

Результат: запросы отправлялись **без cookies**, NestJS AuthGuard получал `undefined` в `request.session.userId` → 401 Unauthorized.

## Решение

### 1. Убрали чтение токена из Cookies ✅

**До:**
```typescript
const getAuthHeaders = (): HeadersInit => {
  const token = Cookies.get('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
```

**После:**
```typescript
const getAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};
```

HTTP-only cookie **не нужно** читать вручную — браузер отправляет её автоматически при `credentials: 'include'`.

### 2. Добавили credentials: 'include' во все fetch ✅

Обновлено **15 функций**:

- `getStats()` — статистика админки
- `getUsers()` — список пользователей
- `updateUser()` — обновление юзера
- `deleteUser()` — удаление юзера
- `updateUserRole()` — смена роли
- `toggleUserStatus()` — блокировка/разблокировка
- `getBoards()` — список досок
- `createBoard()` — создание доски
- `updateBoard()` — обновление доски
- `deleteBoard()` — удаление доски
- `getThreads()` — список тредов
- `deleteThread()` — удаление треда
- `getReplies()` — список ответов
- `deleteReply()` — удаление ответа
- `getMediaFiles()` — список медиафайлов

**Пример изменения:**
```typescript
const response = await fetch(`${BASE_URL}/admin/stats`, {
  headers: getAuthHeaders(),
  credentials: 'include', // ← Добавлено
});
```

## Как работает сейчас

1. **Клиент:** Браузер автоматически отправляет `Cookie: session=<sid>` с каждым запросом к `localhost:4000` (если `credentials: 'include'`)
2. **NestJS:** `express-session` middleware читает `session` cookie → загружает данные из Redis → устанавливает `req.session.userId`
3. **AuthGuard:** Проверяет `request.session.userId` → находит → пропускает запрос
4. **Controller:** Выполняет логику админки

## Проверка

### 1. Откройте DevTools → Network

### 2. Перейдите на `/admin`

### 3. Проверьте запрос `GET /admin/stats`

**Request Headers** должны содержать:
```
Cookie: session=s%3A<длинный_идентификатор>
```

**Response Status** должен быть:
```
200 OK
```

Не должно быть:
```
401 Unauthorized
```

## Связанные изменения

- `nestjs-server/.env` — `SESSION_DOMAIN=` (пустой)
- `client-next/src/features/profile/hooks/useProfile.ts` — `/admin` убран из publicRoots
- `client-next/src/features/admin/services/admin.service.ts` — все запросы теперь с `credentials: 'include'`

## Важно

**НЕ используйте** `Cookies.get()` для HTTP-only cookies — они недоступны JavaScript.  
**Всегда** добавляйте `credentials: 'include'` в fetch-запросы, требующие авторизацию через session.

---

**Дата:** 12 декабря 2025  
**Статус:** ✅ Исправлено
