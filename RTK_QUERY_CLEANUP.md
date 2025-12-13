# RTK Query Cleanup - December 12, 2025

## Что было сделано

### Переименованные файлы (RTK Query → .old.ts)

Старые RTK Query сервисы переименованы для сохранения как референс:

1. `src/services/api.ts` → `api.old.ts`
2. `src/services/admin.service.ts` → `admin.service.old.ts`
3. `src/services/forum.service.ts` → `forum.service.old.ts`
4. `src/services/news.service.ts` → `news.service.old.ts`
5. `src/services/caht.service.ts` → `caht.service.old.ts`

### Файлы требующие миграции

#### Admin компоненты (нужно обновить на features/admin)

1. **shared/components/admin/UserManagement.tsx**
   - Импортирует: `useGetAdminUsersQuery`, `useUpdateAdminUserMutation`, `useDeleteAdminUserMutation`, `useUpdateAdminUserRoleMutation`, `useToggleAdminUserStatusMutation`
   - **Заменить на**: `useAdminUsers`, `useUpdateUser`, `useDeleteUser`, `useUpdateUserRole`, `useToggleUserStatus` из `@/src/features/admin`

2. **shared/components/admin/UserManagement.new.tsx**
   - То же самое

3. **shared/components/admin/BoardManagement.tsx**
   - Импортирует: `useGetAdminBoardsQuery`, `useUpdateAdminBoardMutation`, `useDeleteAdminBoardMutation`
   - **Заменить на**: `useAdminBoards`, `useUpdateBoard`, `useDeleteBoard` из `@/src/features/admin`

4. **shared/components/admin/AdminCreateBoardModal.tsx**
   - Импортирует: `useCreateAdminBoardMutation`
   - **Заменить на**: `useCreateBoard` из `@/src/features/admin`

5. **shared/components/admin/AdminCreateBoardModal.new.tsx**
   - То же самое

6. **shared/components/admin/MediaManagement.tsx**
   - Импортирует: `useGetAdminMediaQuery`, `useDeleteAdminMediaMutation`
   - **Заменить на**: `useAdminMedia` из `@/src/features/admin` (delete пока нет в API)

7. **shared/components/admin/ThreadManagement.tsx**
   - Импортирует: `useGetAdminThreadsQuery`, `useDeleteAdminThreadMutation`
   - **Заменить на**: `useAdminThreads`, `useDeleteThread` из `@/src/features/admin`

8. **shared/components/admin/ReplyManagement.tsx**
   - Импортирует: `useGetAdminRepliesQuery`, `useDeleteAdminReplyMutation`
   - **Заменить на**: `useAdminReplies`, `useDeleteReply` из `@/src/features/admin`

9. **shared/components/admin/CategoryManagement.tsx**
   - Нужно проверить, есть ли categories в новом API

10. **shared/components/admin/TagManagement.tsx**
    - Нужно проверить, есть ли tags в новом API

#### Forum компоненты (нужно обновить на features/forum)

11. **shared/components/ReplyToPostModal.tsx**
    - Импортирует: `useCreateReplyMutation` из `@/src/services/forum.service`
    - **Заменить на**: `useCreateReply` из `@/src/features/forum`

#### Post компоненты (нужно обновить на features/post)

12. **shared/components/ui/post/Card/index.tsx**
    - Импортирует: `useDeletePostMutation`
    - **Заменить на**: `useDeletePost` из `@/src/features/post`

13. **shared/components/ui/post/CreatePost/index.tsx**
    - Импортирует: `useCreatePostMutation`
    - **Заменить на**: `useCreatePost` из `@/src/features/post`

14. **shared/components/ui/post/PostModals/EditPost.tsx**
    - Импортирует: `useUpdatePostMutation`
    - **Заменить на**: `useUpdatePost` из `@/src/features/post`

15. **shared/components/providers/ViewsProvider.tsx**
    - Импортирует: `useAddViewsBatchMutation`
    - **Заменить на**: `useAddViewsBatch` из `@/src/features/post` (если есть)

### Store cleanup (TODO)

Нужно удалить/закомментировать из `src/store/`:
- RTK Query middleware
- RTK Query reducers
- Импорты из старых сервисов

### Package.json (TODO)

Можно оставить `@reduxjs/toolkit` если используется для обычного Redux (не RTK Query).
Если используется только для RTK Query - можно удалить зависимость.

---

## Миграция: Шаблон замены

### Было (RTK Query):
```typescript
import { useGetAdminUsersQuery, useUpdateAdminUserMutation } from '@/src/services/admin.service';

const { data, isLoading, refetch } = useGetAdminUsersQuery({ page, limit });
const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();

await updateUser({ userId, ...data }).unwrap();
refetch();
```

### Стало (React Query):
```typescript
import { useAdminUsers, useUpdateUser } from '@/src/features/admin';

const { data, isLoading } = useAdminUsers({ page, limit });
const updateUser = useUpdateUser();

updateUser.mutate({ userId, data });
// refetch автоматический через invalidateQueries
```

---

## Статус миграции

- ✅ Файлы переименованы в .old.ts
- ⏳ Компоненты нужно обновить (15+ файлов)
- ⏳ Store cleanup
- ⏳ Package.json cleanup

---

**Дата**: 12 декабря 2025 г.
