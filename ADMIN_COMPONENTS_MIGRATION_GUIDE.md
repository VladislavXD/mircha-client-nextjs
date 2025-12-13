# Миграция компонентов админки с RTK Query на React Query

## Проблема

Компоненты в `client-next/shared/components/admin/` используют старые RTK Query хуки из `admin.service.old`, которые:
1. Не поддерживают HTTP-only session cookie
2. Используют устаревшую архитектуру
3. Несовместимы с новым NestJS API

## Решение

Все компоненты должны использовать новые React Query хуки из `@/src/features/admin`.

## Ключевые изменения

### 1. Импорты

**Старый** (RTK Query):
```tsx
import { 
  useGetAdminUsersQuery, 
  useCreateAdminUserMutation, 
  useUpdateAdminUserMutation, 
  useDeleteAdminUserMutation,
  type AdminUser,
  type UsersFilter
} from '@/src/services/admin.service.old'
```

**Новый** (React Query):
```tsx
import { 
  useAdminUsers, 
  useUpdateUser, 
  useDeleteUser, 
  useUpdateUserRole, 
  useToggleUserStatus 
} from '@/src/features/admin'
import type { AdminUser, GetUsersQueryParams } from '@/src/features/admin/types/admin.types'
```

### 2. Использование хуков

**Старый**:
```tsx
const { data: usersData, isLoading, error, refetch } = useGetAdminUsersQuery(filters)
const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation()
const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation()
const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation()
```

**Новый**:
```tsx
const { data: usersData, isLoading, error, refetch } = useAdminUsers(filters)
const updateUserMutation = useUpdateUser()
const deleteUserMutation = useDeleteUser()
const updateRoleMutation = useUpdateUserRole()
const toggleStatusMutation = useToggleUserStatus()
```

### 3. Вызов мутаций

**Старый** (RTK Query `.unwrap()`):
```tsx
await updateUser({ id: userId, data: updateData }).unwrap()
await deleteUser(userId).unwrap()
refetch() // Нужно вручную обновлять
```

**Новый** (React Query `.mutateAsync()`):
```tsx
await updateUserMutation.mutateAsync({ userId, data: updateData })
await deleteUserMutation.mutateAsync(userId)
// refetch автоматически через queryClient.invalidateQueries
```

### 4. Проверка состояния мутации

**Старый**:
```tsx
{isCreating && <Spinner />}
{isUpdating && <Spinner />}
{isDeleting && <Spinner />}
```

**Новый**:
```tsx
{updateUserMutation.isPending && <Spinner />}
{deleteUserMutation.isPending && <Spinner />}
{toggleStatusMutation.isPending && <Spinner />}
```

### 5. Типы данных

#### AdminUser
**Изменения полей**:
- `username` → `name` (string | null)
- `_count.posts` → `_count.post` (number)
- `_count.replies` удалено, есть `_count.comments`
- `role`: `"USER" | "ADMIN" | "MODERATOR"` → `"REGULAR" | "ADMIN"`

#### AdminUsersResponse
**Старый**:
```tsx
{
  users: AdminUser[]
  total: number
  page: number
  totalPages: number
}
```

**Новый**:
```tsx
{
  users: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

**Обращение к полям**:
```tsx
// Старый
const total = usersData?.total || 0
const totalPages = usersData?.totalPages || 1

// Новый
const total = usersData?.pagination.total || 0
const totalPages = usersData?.pagination.pages || 1
```

#### GetUsersQueryParams
**Изменения**:
- `role`: `string` → `"regular" | "admin"` (lowercase!)
- Добавлены: `sortBy`, `sortOrder`

**Адаптация фильтров**:
```tsx
// Нормализация роли перед отправкой
const apiFilters: GetUsersQueryParams = {
  ...filters,
  role: filters.role ? filters.role.toLowerCase() as 'regular' | 'admin' : undefined
}

const { data } = useAdminUsers(apiFilters)
```

## Пошаговая миграция компонентов

### UserManagement.tsx

1. ✅ Обновить импорты хуков
2. ✅ Заменить хуки на React Query версии
3. ⏳ Адаптировать типы фильтров (role lowercase)
4. ⏳ Заменить `username` на `name`
5. ⏳ Обновить `_count.posts` → `_count.post`
6. ⏳ Обновить структуру `usersData` (pagination)
7. ⏳ Заменить `.unwrap()` на `.mutateAsync()`
8. ⏳ Обновить проверки `isCreating/isUpdating/isDeleting` на `.isPending`

### BoardManagement.tsx

1. Импорт `useAdminBoards`, `useCreateBoard`, `useUpdateBoard`, `useDeleteBoard`
2. Заменить RTK хуки
3. Адаптировать типы `BoardsFilter` → `PaginationQueryParams`
4. Обновить структуру ответа (`.pagination`)
5. Заменить мутации на `.mutateAsync()`

### ThreadManagement.tsx

1. Импорт `useAdminThreads`, `useDeleteThread`
2. Заменить RTK хуки
3. Адаптировать типы
4. Обновить структуру ответа
5. Заменить мутации

### ReplyManagement.tsx

1. Импорт `useAdminReplies`, `useDeleteReply`
2. Аналогично ThreadManagement

### MediaManagement.tsx

1. Импорт `useAdminMedia`
2. Только query, без мутаций

### CategoryManagement.tsx & TagManagement.tsx

1. Проверить использование старых сервисов
2. Обновить при необходимости

## Важные замечания

1. **credentials: 'include' уже добавлен** в `admin.service.ts` — компоненты просто используют хуки.

2. **Автоматический refetch**: React Query автоматически инвалидирует кеш после мутаций через `queryClient.invalidateQueries()` внутри хуков.

3. **Создание пользователей**: В новом API пока нет `useCreateUser` — нужно либо добавить этот хук, либо скрыть кнопку "Добавить пользователя".

4. **Обработка ошибок**: React Query предоставляет `error` объект напрямую, не нужно `.unwrap()`.

5. **Роли**: В NestJS используются `REGULAR` и `ADMIN` (uppercase), но в query параметрах — lowercase (`'regular' | 'admin'`).

## Статус миграции

- [ ] `UserManagement.tsx` — в процессе
- [ ] `BoardManagement.tsx` — не начато
- [ ] `ThreadManagement.tsx` — не начато
- [ ] `ReplyManagement.tsx` — не начато
- [ ] `MediaManagement.tsx` — не начато
- [ ] `CategoryManagement.tsx` — не начато
- [ ] `TagManagement.tsx` — не начато
- [x] `AdminDashboard.tsx` — уже использует React Query

---

**Дата:** 12 декабря 2025  
**Статус:** В процессе миграции
