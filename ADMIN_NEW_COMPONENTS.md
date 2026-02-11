# Новые компоненты админки с React Query

## Создано

### UserManagement.tsx ✅

**Путь:** `src/features/admin/components/UserManagement.tsx`

**Особенности:**
- ✅ Использует React Query хуки: `useAdminUsers`, `useUpdateUser`, `useDeleteUser`, `useUpdateUserRole`, `useToggleUserStatus`
- ✅ HTTP-only session cookie (credentials: 'include' в admin.service.ts)
- ✅ Правильные типы из `features/admin/types/admin.types.ts`
- ✅ Pagination через `usersData.pagination`
- ✅ Роли: `REGULAR` / `ADMIN` (uppercase в UI, lowercase в API)
- ✅ Поля: `name` вместо `username`, `_count.post` вместо `_count.posts`
- ✅ Мутации через `.mutateAsync()` с автоматическим refetch
- ✅ Состояния загрузки через `.isPending`

**API методы:**
- GET `/admin/users` — список пользователей
- PUT `/admin/users/:userId` — обновление данных
- DELETE `/admin/users/:userId` — удаление
- PUT `/admin/users/:userId/role` — смена роли
- PATCH `/admin/users/:userId/status` — блокировка/разблокировка

**Функциональность:**
- Поиск по имени/email
- Фильтр по роли (regular/admin)
- Редактирование (имя, email, роль, статус)
- Удаление пользователя
- Быстрое переключение статуса (активен/заблокирован)
- Быстрая смена роли (пользователь ↔ администратор)
- Пагинация

## Использование

### В adminPage.tsx

```tsx
import { UserManagement } from '@/src/features/admin'

// В табах:
{
  id: 'users',
  label: 'Пользователи',
  icon: MdPeople,
  component: <UserManagement />,
  allowedRoles: ['ADMIN']
}
```

## Старый компонент

**Путь:** `shared/components/admin/UserManagement.tsx`

Оставлен для обратной совместимости. Использует RTK Query (устаревший).

## Следующие компоненты

- [ ] BoardManagement.tsx
- [ ] ThreadManagement.tsx
- [ ] ReplyManagement.tsx
- [ ] MediaManagement.tsx
- [ ] CategoryManagement.tsx
- [ ] TagManagement.tsx

## Структура features/admin

```
src/features/admin/
├── components/
│   ├── UserManagement.tsx ✅
│   └── index.ts
├── hooks/
│   └── useAdmin.ts (все хуки готовы)
├── services/
│   └── admin.service.ts (с credentials: include)
├── types/
│   └── admin.types.ts
└── index.ts (barrel export)
```

---

**Дата:** 12 декабря 2025  
**Статус:** UserManagement готов, остальные в процессе
