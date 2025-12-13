# Оптимизация системы онлайн-статусов

## 📊 Архитектура

### Centralized State Management (Redux)
```
SocketConnectionManager (глобальный)
    ↓ подписывается на Socket.IO события
    ↓ сохраняет в Redux Store
    ↓
Redux Store (единственный источник истины)
    ↓ читают данные
    ↓
useOnlineStatus / useOnlineStatuses (компоненты)
```

## ✨ Основные улучшения

### 1. **Убрано дублирование подписок**
**Было:** Каждый компонент подписывался на Socket.IO события
```typescript
// ❌ Каждый useOnlineStatus создавал свою подписку
socketService.onUserStatusChange(...)
socketService.onGlobalUserStatusChange(...)
socketService.onCurrentOnlineStatuses(...)
socketService.onGlobalOnlineStatuses(...)
```

**Стало:** Одна глобальная подписка в SocketConnectionManager
```typescript
// ✅ Одна подписка для всего приложения
// lib/SocketConnectionManager.tsx
socketService.onGlobalOnlineStatuses((statuses) => {
  dispatch(setMultipleStatuses(statuses));
});
```

### 2. **Удалено избыточное локальное состояние**
**Было:** 
- Redux State
- Local State в каждом хуке
- Синхронизация между ними через useEffect

**Стало:** Только Redux State
```typescript
// ✅ Прямое чтение из Redux без локального состояния
const statusFromRedux = useAppSelector(state => 
  userId ? state.onlineStatus.statuses[userId] : undefined
);
```

### 3. **Оптимизированы вычисления**
**Было:** 257 строк с множественными useEffect и useState
**Стало:** 71 строка с useMemo для мемоизации

```typescript
// ✅ Мемоизация предотвращает ненужные рендеры
const statuses = useMemo(() => {
  const result: Record<string, boolean> = {};
  validUserIds.forEach(userId => {
    result[userId] = statusesFromRedux[userId] ?? false;
  });
  return result;
}, [statusesFromRedux, validUserIds.join(',')]);
```

### 4. **Убраны debug логи**
**Было:** ~20 console.log в продакшене
**Стало:** Только критичные ошибки

### 5. **Удалены неиспользуемые импорты**
```typescript
// ❌ Удалено
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';
```

## 📈 Метрики производительности

### Размер кода
- **useOnlineStatus.ts**: 257 строк → 71 строка (-72%)
- **SocketConnectionManager.tsx**: 74 строки → 50 строк (-32%)

### Количество подписок Socket.IO
- **Было**: N компонентов × 4 события = 4N подписок
- **Стало**: 2 глобальные подписки (независимо от количества компонентов)

### Рендеры компонентов
- **Было**: Каждое событие → setState → ререндер
- **Стало**: Redux изменение → только affected компоненты ререндерятся

### Memory Footprint
- **Было**: Дублирование данных (Redux + local state в каждом хуке)
- **Стало**: Одна копия данных в Redux

## 🔧 API хуков

### useOnlineStatus(userId)
Для получения статуса одного пользователя
```typescript
import { useOnlineStatus } from '@/src/features/chat/hooks/useOnlineStatus';

function UserCard({ userId }) {
  const { isOnline } = useOnlineStatus(userId);
  
  return <div>{isOnline ? '🟢 Online' : '⚫ Offline'}</div>;
}
```

### useOnlineStatuses(userIds)
Для получения статусов нескольких пользователей (оптимизировано для списков)
```typescript
import { useOnlineStatuses } from '@/src/features/chat/hooks/useOnlineStatus';

function ChatList({ chats }) {
  const userIds = chats.map(c => c.userId);
  const { getStatus, statuses } = useOnlineStatuses(userIds);
  
  return (
    <>
      {chats.map(chat => (
        <div key={chat.id}>
          {getStatus(chat.userId) ? '🟢' : '⚫'} {chat.name}
        </div>
      ))}
    </>
  );
}
```

## 🎯 Best Practices

### 1. Не создавайте дополнительные подписки
```typescript
// ❌ НЕ ДЕЛАЙТЕ ТАК
useEffect(() => {
  socketService.onGlobalUserStatusChange(...);
}, []);

// ✅ Используйте хуки
const { isOnline } = useOnlineStatus(userId);
```

### 2. Для списков используйте useOnlineStatuses
```typescript
// ❌ Медленно: N хуков
users.map(user => {
  const { isOnline } = useOnlineStatus(user.id); // N подписок
});

// ✅ Быстро: 1 хук
const { getStatus } = useOnlineStatuses(users.map(u => u.id));
users.map(user => getStatus(user.id));
```

### 3. Redux автоматически обновляется
Не нужно вручную обновлять статусы - SocketConnectionManager делает это автоматически.

## 🐛 Troubleshooting

### Статусы не обновляются
1. Проверьте, что SocketConnectionManager подключен в Providers
2. Проверьте Redux DevTools - данные должны быть в `onlineStatus.statuses`
3. Проверьте консоль браузера на ошибки подключения Socket.IO

### Высокое потребление памяти
Убедитесь, что не создаете дополнительные подписки на события Socket.IO в компонентах.

## 🚀 Дальнейшие улучшения

### Production optimizations
1. **Code splitting**: Ленивая загрузка Socket.IO клиента
2. **Service Worker**: Кэширование статусов оффлайн
3. **Compression**: Сжатие Socket.IO сообщений

### Monitoring
```typescript
// Добавить метрики
const metricsMiddleware = store => next => action => {
  if (action.type === 'onlineStatus/setUserStatus') {
    // Track status changes
    analytics.track('user_status_change', {
      userId: action.payload.userId,
      isOnline: action.payload.isOnline
    });
  }
  return next(action);
};
```

## 📝 Changelog

### v2.0.0 (Декабрь 2024) - Оптимизация
- ✅ Централизованные Socket.IO подписки
- ✅ Удалено локальное состояние из хуков
- ✅ Мемоизация вычислений
- ✅ Удалено 186 строк кода (-72%)
- ✅ Уменьшено количество подписок с 4N до 2

### v1.0.0 - Initial implementation
- Redux store для онлайн-статусов
- useOnlineStatus и useOnlineStatuses хуки
- Socket.IO интеграция
