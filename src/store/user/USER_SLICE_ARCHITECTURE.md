# 🏗️ Архитектура User Slice

## Концепция: Минимальные данные в Redux

### ❌ Старый подход (user.sliceOLD.ts)
```typescript
interface InitialState {
  user: User | null  // ← ПОЛНЫЙ объект User (id, email, name, avatarUrl, bio, posts, etc.)
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string
}
```

**Проблемы:**
- 🐘 Тяжелый state (дублирование данных из RTK Query/React Query)
- 🔄 Сложная синхронизация (extraReducers с 4 matchers)
- 💾 Избыточное хранение в localStorage через persist

---

### ✅ Новый подход (user.slice.ts)

```typescript
// Минимальный интерфейс для Redux
interface IUserState {
  email: string                      // ← Для отображения в UI
  role?: 'ADMIN' | 'MODERATOR' | 'USER'  // ← Для проверки прав доступа
}

interface IInitialState {
  user: IUserState | null   // ← МИНИМАЛЬНЫЙ объект
  isLoading: boolean        // ← Состояние загрузки
  error?: string            // ← Ошибки авторизации
  isAuthenticated: boolean  // ← Статус авторизации
  token?: string            // ← JWT токен
}
```

**Преимущества:**
- ⚡ Легкий state (только email + role)
- 🎯 Быстрый доступ к критичным данным
- 💾 Минимальный размер в localStorage
- 🔒 Безопасность (не храним чувствительные данные)

---

## 🔄 Как это работает

### 1. Логин/Регистрация

```typescript
// Backend возвращает полный User объект
interface IAuthResponse {
  token: string
  user: User  // ← Полный объект с id, name, avatarUrl, bio, etc.
}

// Redux сохраняет только минимум
.addCase(login.fulfilled, (state, { payload }) => {
  state.isLoading = false
  state.user = {
    email: payload.user.email,    // ← Только email
    role: payload.user.role        // ← Только role
  }
})
```

### 2. Получение полных данных пользователя

Для полного профиля используй **React Query** (в будущем) или **RTK Query** (сейчас):

```typescript
// Компонент Profile
import { useCurrentQuery } from '@/src/services/user/user.service'
import { useAppSelector } from '@/src/hooks/reduxHooks'
import { selectUser } from '@/src/store/user/user.slice'

function ProfilePage() {
  // Redux: только email + role (быстро, из localStorage)
  const minimalUser = useAppSelector(selectUser)
  
  // React Query/RTK Query: полный профиль (с кэшем)
  const { data: fullUser } = useCurrentQuery()
  
  return (
    <div>
      <h1>{fullUser?.name}</h1>
      <img src={fullUser?.avatarUrl} />
      <p>Email: {minimalUser?.email}</p>
      <p>Role: {minimalUser?.role}</p>
    </div>
  )
}
```

---

## 🎯 Где использовать минимальные данные (IUserState)

### ✅ Используй `selectUser` для:

1. **Navbar/Header** - отображение email
   ```typescript
   const user = useAppSelector(selectUser)
   return <div>Привет, {user?.email}</div>
   ```

2. **Проверка прав доступа**
   ```typescript
   const user = useAppSelector(selectUser)
   const isAdmin = user?.role === 'ADMIN'
   
   if (!isAdmin) return <AccessDenied />
   ```

3. **Условный рендеринг**
   ```typescript
   const isAuthenticated = useAppSelector(selectIsAuthenticated)
   if (!isAuthenticated) return <Redirect to="/login" />
   ```

### ❌ НЕ используй для:

1. **Профиль пользователя** - нужен полный User (name, avatarUrl, bio)
2. **Список постов** - нужен User с posts[]
3. **Редактирование профиля** - нужны все поля User

**Для этих случаев используй:**
- `useCurrentQuery()` (RTK Query) - сейчас
- `useCurrentUser()` (React Query) - после миграции

---

## 📦 Redux Persist

Redux Persist сохраняет **весь user slice** в localStorage:

```typescript
// localStorage
{
  "user": {
    "user": { "email": "test@test.com", "role": "USER" },
    "isAuthenticated": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isLoading": false,
    "error": null
  }
}
```

**Размер:** ~500 байт (vs 5KB для полного User объекта)

---

## 🔧 API

### Селекторы
```typescript
import { 
  selectUser,           // IUserState | null
  selectIsAuthenticated,// boolean
  selectIsLoading,      // boolean
  selectError,          // string | undefined
  selectToken           // string | undefined
} from '@/src/store/user/user.slice'

// Использование
const user = useAppSelector(selectUser)
const isAuth = useAppSelector(selectIsAuthenticated)
```

### Actions
```typescript
import { login, register, logout } from '@/src/store/user/user.actions'

// В компоненте
const dispatch = useAppDispatch()

dispatch(login({ 
  email: 'test@test.com', 
  password: '123',
  recaptchaToken: 'xxx' 
}))
```

---

## 🚀 Следующие шаги (миграция на React Query)

После внедрения React Query:

1. **Redux**: только `token` + `isAuthenticated`
   ```typescript
   interface UserState {
     token: string | null
     isAuthenticated: boolean
     // БЕЗ user, isLoading, error
   }
   ```

2. **React Query**: все данные пользователя
   ```typescript
   const { data: user, isLoading, error } = useCurrentUser()
   ```

3. **Преимущества:**
   - ✅ SSR prefetch (SEO)
   - ✅ Автоматическая инвалидация кэша
   - ✅ Optimistic updates
   - ✅ Разделение server state и UI state

---

## 📊 Сравнение

| Критерий | Старый (user.sliceOLD) | Новый (user.slice) | React Query (будущее) |
|----------|----------------------|-------------------|---------------------|
| **Размер в Redux** | ~5KB | ~500 bytes | ~100 bytes (только token) |
| **Persist size** | ~5KB | ~500 bytes | ~100 bytes |
| **Синхронизация** | extraReducers (4 matchers) | createAsyncThunk | Автоматически |
| **SSR** | ❌ Нет | ❌ Нет | ✅ Да |
| **Кэширование** | ❌ Нет | ❌ Нет | ✅ Да (staleTime) |
| **Оценка** | 3/10 | 7/10 | 10/10 |

---

## 📝 Миграция старого кода

### Если используешь `selectCurrent` (из OLD slice)

**Старый код:**
```typescript
import { selectCurrent } from '@/src/store/user/user.sliceOLD'
const currentUser = useAppSelector(selectCurrent)  // Полный User
```

**Новый код:**
```typescript
// Для минимальных данных (email, role)
import { selectUser } from '@/src/store/user/user.slice'
const minimalUser = useAppSelector(selectUser)

// Для полного профиля
import { useCurrentQuery } from '@/src/services/user/user.service'
const { data: fullUser } = useCurrentQuery()
```

---

## ✅ Checklist

- [x] Создан минимальный интерфейс `IUserState`
- [x] Redux хранит только `email` + `role`
- [x] Настроен Redux Persist
- [x] Добавлен маппинг `User` → `IUserState` в extraReducers
- [x] Экспортированы селекторы
- [ ] Подключен React Query Provider
- [ ] Мигрированы Login/Register компоненты
- [ ] Обновлены все useAppSelector(selectCurrent) → useCurrentQuery()
- [ ] Удален старый user.sliceOLD.ts

---

## 🆘 Помощь

Если нужна полная миграция на React Query, смотри:
- `/src/testUpdate/queries/useUser.ts` - готовые хуки
- `/src/testUpdate/api/user.ts` - API функции
- `USER_DATA_ARCHITECTURE.md` - полная документация
