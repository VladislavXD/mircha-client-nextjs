# Client Admin Migration - December 12, 2025

## Обзор

Миграция административной панели с RTK Query на React Query + современную структуру features.

---

## Структура Admin Feature

```
client-next/src/features/admin/
├── types/
│   └── admin.types.ts          # TypeScript интерфейсы
├── services/
│   └── admin.service.ts        # API клиент (fetch)
├── hooks/
│   └── useAdmin.ts             # React Query хуки
└── index.ts                    # Barrel export
```

---

## Созданные файлы

### 1. Types (`admin.types.ts`)

**Основные типы:**
- `AdminStats` - статистика системы
- `AdminUser` - пользователь с admin-полями
- `AdminBoard` - доска с метриками
- `AdminThread` - тред с вложенной board
- `AdminReply` - ответ с вложенным thread
- `AdminMediaFile` - медиафайл с thread
- Query params: `PaginationQueryParams`, `GetUsersQueryParams`
- DTOs: `UpdateUserRoleDto`, `UpdateUserDto`, `CreateBoardDto`, `UpdateBoardDto`

**Ключевые изменения:**
- Роли: `'REGULAR' | 'ADMIN'` (было `'USER' | 'MODERATOR' | 'ADMIN'`)
- Все даты в формате ISO string
- Пагинация включает `pages: number`

### 2. Service (`admin.service.ts`)

**Реализованные методы:**

**Статистика:**
- `getStats()` → `AdminStats`

**Пользователи:**
- `getUsers(params)` → `AdminUsersResponse`
- `updateUser(userId, data)` → `UpdatedUserResponse`
- `deleteUser(userId)` → `AdminActionResponse`
- `updateUserRole(userId, data)` → `UpdatedUserRoleResponse`
- `toggleUserStatus(userId)` → `ToggledUserStatusResponse`

**Доски:**
- `getBoards(params)` → `AdminBoardsResponse`
- `createBoard(data)` → `AdminBoard`
- `updateBoard(boardId, data)` → `AdminBoard`
- `deleteBoard(boardId)` → `AdminActionResponse`

**Треды:**
- `getThreads(params)` → `AdminThreadsResponse`
- `deleteThread(threadId)` → `AdminActionResponse`

**Ответы:**
- `getReplies(params)` → `AdminRepliesResponse`
- `deleteReply(replyId)` → `AdminActionResponse`

**Медиа:**
- `getMediaFiles(params)` → `AdminMediaFilesResponse`

**Утилиты:**
- `getAuthHeaders()` - получить заголовки с JWT
- `handleApiError()` - обработка ошибок
- `buildQueryString()` - построение query params

### 3. Hooks (`useAdmin.ts`)

**Query Keys:**
```typescript
adminKeys = {
  all: ['admin'],
  stats: () => ['admin', 'stats'],
  users: (params) => ['admin', 'users', params],
  boards: (params) => ['admin', 'boards', params],
  threads: (params) => ['admin', 'threads', params],
  replies: (params) => ['admin', 'replies', params],
  media: (params) => ['admin', 'media', params],
}
```

**Queries:**
- `useAdminStats()` - стат истика (staleTime: 30s)
- `useAdminUsers(params)` - пользователи (staleTime: 60s)
- `useAdminBoards(params)` - доски (staleTime: 60s)
- `useAdminThreads(params)` - треды (staleTime: 30s)
- `useAdminReplies(params)` - ответы (staleTime: 30s)
- `useAdminMedia(params)` - медиа (staleTime: 60s)

**Mutations:**
- `useUpdateUser()` - обновить пользователя
- `useDeleteUser()` - удалить пользователя
- `useUpdateUserRole()` - изменить роль
- `useToggleUserStatus()` - переключить статус
- `useCreateBoard()` - создать доску
- `useUpdateBoard()` - обновить доску
- `useDeleteBoard()` - удалить доску
- `useDeleteThread()` - удалить тред
- `useDeleteReply()` - удалить ответ

**Автоматическая инвалидация:**
- После мутаций автоматически инвалидируются связанные queries
- Обновление stats после изменения пользователей/досок/тредов

---

## Использование

### Импорт

```typescript
import {
  useAdminStats,
  useAdminUsers,
  useUpdateUser,
  useDeleteUser,
  type AdminUser,
  type UpdateUserDto
} from '@/src/features/admin';
```

### Примеры

**Получить статистику:**
```typescript
const { data: stats, isLoading, error } = useAdminStats();
```

**Получить пользователей с фильтрацией:**
```typescript
const { data, isLoading } = useAdminUsers({
  page: 1,
  limit: 20,
  role: 'admin',
  search: 'john',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// data.users: AdminUser[]
// data.pagination: { page, limit, total, pages }
```

**Обновить пользователя:**
```typescript
const updateUser = useUpdateUser();

const handleUpdate = () => {
  updateUser.mutate({
    userId: 'user-id',
    data: {
      role: 'admin',
      isActive: true
    }
  }, {
    onSuccess: () => {
      console.log('Пользователь обновлен');
    },
    onError: (error) => {
      console.error('Ошибка:', error);
    }
  });
};
```

**Удалить пользователя:**
```typescript
const deleteUser = useDeleteUser();

const handleDelete = (userId: string) => {
  if (confirm('Удалить пользователя?')) {
    deleteUser.mutate(userId);
  }
};
```

**Создать доску:**
```typescript
const createBoard = useCreateBoard();

const handleCreate = (data: CreateBoardDto) => {
  createBoard.mutate(data, {
    onSuccess: (board) => {
      console.log('Доска создана:', board.id);
    }
  });
};
```

---

## Обновленные компоненты

### ✅ AdminDashboard

**До:**
```typescript
import { useGetAdminStatsQuery } from '@/src/services/admin.service';
const { data: stats, isLoading, error } = useGetAdminStatsQuery();
```

**После:**
```typescript
import { useAdminStats } from '@/src/features/admin';
const { data: stats, isLoading, error } = useAdminStats();
```

**Изменения:**
- Удалены упоминания `moderators` из статистики
- Обновлены типы под новую схему

### ⏳ Остальные компоненты (в процессе)

- UserManagement
- BoardManagement
- ThreadManagement
- ReplyManagement
- MediaManagement
- CategoryManagement
- TagManagement

---

## Миграция компонентов

### Шаблон миграции

**1. Заменить импорты:**
```typescript
// Старое
import { useGetUsersQuery, useUpdateUserMutation } from '@/src/services/admin.service';

// Новое
import { useAdminUsers, useUpdateUser } from '@/src/features/admin';
```

**2. Обновить хуки:**
```typescript
// Старое (RTK Query)
const { data, isLoading, refetch } = useGetUsersQuery({ page, limit });
const [updateUser] = useUpdateUserMutation();

// Новое (React Query)
const { data, isLoading } = useAdminUsers({ page, limit });
const updateUser = useUpdateUser();
```

**3. Обновить вызовы мутаций:**
```typescript
// Старое
await updateUser({ userId, ...data }).unwrap();
refetch();

// Новое
updateUser.mutate({ userId, data });
// refetch автоматический через invalidateQueries
```

**4. Обновить типы:**
```typescript
// Импортировать типы из features
import type { AdminUser, UpdateUserDto } from '@/src/features/admin';
```

---

## Различия RTK Query ↔ React Query

| Аспект | RTK Query | React Query |
|--------|-----------|-------------|
| **Хуки** | `useGetDataQuery` | `useData` |
| **Мутации** | `useUpdateDataMutation` | `useUpdateData` |
| **Вызов мутации** | `mutate(args).unwrap()` | `mutate(args)` |
| **Refetch** | Ручной `refetch()` | Автоматический через invalidation |
| **Loading** | `isLoading`, `isFetching` | `isLoading` |
| **Кэширование** | Redux store | QueryClient cache |

---

## Следующие шаги

### Миграция компонентов (по приоритету):

1. **UserManagement** - ✅ Самый важный
   - Использует: `useAdminUsers`, `useUpdateUser`, `useDeleteUser`, `useUpdateUserRole`, `useToggleUserStatus`

2. **BoardManagement** - ✅ Важный
   - Использует: `useAdminBoards`, `useCreateBoard`, `useUpdateBoard`, `useDeleteBoard`

3. **ThreadManagement** - ⚠️ Средний
   - Использует: `useAdminThreads`, `useDeleteThread`

4. **ReplyManagement** - ⚠️ Средний
   - Использует: `useAdminReplies`, `useDeleteReply`

5. **MediaManagement** - ⚠️ Средний
   - Использует: `useAdminMedia`

6. **CategoryManagement** - ⏸️ Низкий (возможно, не в новом API)

7. **TagManagement** - ⏸️ Низкий (возможно, не в новом API)

### Обновление adminPage

- Убрать проверку `MODERATOR` роли
- Оставить только `ADMIN`
- Убрать вкладки доступные только для модераторов

---

## Статус миграции

- ✅ Типы созданы
- ✅ Сервис создан (15 методов)
- ✅ Хуки созданы (6 queries + 9 mutations)
- ✅ AdminDashboard обновлен
- ⏳ UserManagement - следующий
- ⏳ Остальные компоненты
- ⏳ adminPage обновление ролей

---

## Заметки

1. **Авторизация**: Токен берется из cookies (`authToken`)
2. **BASE_URL**: Автоматически определяется из `api.url.ts`
3. **Errors**: Все ошибки API обрабатываются через `handleApiError`
4. **Query invalidation**: Автоматическая после мутаций
5. **StaleTime**: Настроен индивидуально для каждого типа данных

---

**Миграция админ feature в процессе! 🚀**
