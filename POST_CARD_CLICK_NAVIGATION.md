# Post Card Click Navigation

## 📋 Overview

Добавлена функциональность клика по карточке поста для перехода на страницу отдельного поста.

## 🎯 Features

### Что работает:
- ✅ Клик по любой части карточки переходит на `/posts/:id`
- ✅ Клик по тексту поста переходит на страницу поста
- ✅ Визуальный feedback: `hover:shadow-lg` и `cursor-pointer`
- ✅ Умное игнорирование интерактивных элементов

### Что НЕ переходит (интерактивные элементы):
- ✅ Аватар автора (переход на профиль `/user/:id`)
- ✅ Dropdown меню (три точки)
- ✅ Кнопка лайка (Heart)
- ✅ Кнопка комментариев (переход на `/posts/:id`)
- ✅ Медиа слайдер (открытие полноэкранного просмотра)
- ✅ Кнопки навигации слайдера (prev/next)
- ✅ Спойлеры (раскрытие по первому клику)

## 🔧 Implementation Details

### 1. **PostCard.tsx**

#### Обработчик клика на карточку:
```typescript
const handleCardClick = (e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // Игнорируем клики по интерактивным элементам
  if (
    target.closest('a') || 
    target.closest('button') || 
    target.closest('[role="button"]') ||
    target.closest('.swiper-button-next') ||
    target.closest('.swiper-button-prev') ||
    target.getAttribute('data-no-redirect') === 'true'
  ) {
    return;
  }
  
  router.push(`/posts/${id}`);
};
```

#### Изменения в JSX:
```tsx
// 1. Карточка с cursor и hover эффектом
<NextCard 
  className="mb-5 cursor-pointer hover:shadow-lg transition-shadow" 
  onClick={handleCardClick}
>

// 2. Ссылка на профиль с stopPropagation
<Link 
  href={`/user/${authorId}`} 
  onClick={(e) => e.stopPropagation()}
>

// 3. Dropdown с stopPropagation
<div onClick={(e) => e.stopPropagation()}>
  <PostDropdown {...props} />
</div>

// 4. Footer с stopPropagation
<CardFooter 
  className="gap-3" 
  onClick={(e) => e.stopPropagation()}
>
  {/* Лайки и комментарии */}
</CardFooter>

// 5. Ссылка на комментарии с stopPropagation
<Link 
  href={`/posts/${id}`} 
  onClick={(e) => e.stopPropagation()}
>
  <MetaInfo count={commentsCount} Icon={MessageCircle} />
</Link>
```

### 2. **PostMediaSlider.tsx**

#### Обработчик клика на медиа:
```typescript
const handleMediaClick = (index: number, e: React.MouseEvent) => {
  e.stopPropagation(); // Останавливаем всплытие к карточке
  
  // Если спойлер - раскрываем
  if (media[index].spoiler && !revealedSpoilers.has(index)) {
    setRevealedSpoilers(prev => new Set(prev).add(index));
    return;
  }
  
  // Иначе открываем полноэкранный просмотр
  setSelectedIndex(index);
  setShowMediaViewer(true);
};
```

#### Кнопки навигации:
```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    handlePrev(e);
  }}
  onMouseDown={(e) => e.stopPropagation()}
>
  {/* Prev icon */}
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    handleNext(e);
  }}
  onMouseDown={(e) => e.stopPropagation()}
>
  {/* Next icon */}
</button>
```

## 🎨 UX Improvements

### Визуальные индикаторы:
```css
/* Карточка поста */
.cursor-pointer          /* Указатель меняется на руку */
.hover:shadow-lg         /* Тень при наведении */
.transition-shadow       /* Плавная анимация */
```

### Интерактивные зоны:
```
┌─────────────────────────────────────┐
│ ← Клик = /posts/:id                 │
│                                     │
│  [Аватар]  User          [•••]     │  ← stopPropagation
│  ↓ /user/:id             ↓ menu    │
│                                     │
│  Текст поста... ← клик работает    │
│                                     │
│  [Медиа слайдер] ← stopPropagation │
│   ↓ открывает MediaViewer          │
│                                     │
│  👁 123 просмотров                  │
│                                     │
│  ❤️ 10  💬 5  ← stopPropagation     │
│  ↓ like  ↓ /posts/:id              │
└─────────────────────────────────────┘
```

## 🔄 Event Propagation Flow

### Без stopPropagation:
```
Click → Button → CardBody → Card → handleCardClick → router.push()
                                  ↑ Проблема: срабатывает всегда
```

### С stopPropagation:
```
Click → Button → stopPropagation() → ❌ НЕ всплывает к Card
Click → Text   → CardBody → Card → handleCardClick → ✅ router.push()
```

## 📁 Modified Files

1. **PostCard.tsx**
   - Добавлен `handleCardClick` обработчик
   - Добавлены классы `cursor-pointer hover:shadow-lg transition-shadow`
   - Добавлены `stopPropagation` для интерактивных элементов
   - Обернут dropdown в `<div onClick={stopPropagation}>`
   - Добавлен `stopPropagation` для footer и ссылок

2. **PostMediaSlider.tsx**
   - Добавлен `e.stopPropagation()` в `handleMediaClick`
   - Добавлены wrapper функции для `handlePrev` и `handleNext`
   - Кнопки навигации останавливают propagation

## 🧪 Testing Scenarios

### ✅ Should navigate to post:
1. Клик по пустому месту карточки
2. Клик по тексту поста
3. Клик по счетчику просмотров
4. Клик по фону между элементами

### ❌ Should NOT navigate to post:
1. Клик по аватару (переход на `/user/:id`)
2. Клик по dropdown (открытие меню)
3. Клик по кнопке лайка (лайк поста)
4. Клик по кнопке комментариев (переход на `/posts/:id`)
5. Клик по медиа (открытие MediaViewer)
6. Клик по стрелкам слайдера (навигация)
7. Клик по спойлеру (раскрытие спойлера)

## 🎯 Benefits

1. **Better UX** - пользователь может кликнуть куда угодно для перехода
2. **Intuitive** - карточка ведет себя как ссылка
3. **Visual Feedback** - `cursor-pointer` и тень при наведении
4. **Smart Detection** - автоматически игнорирует интерактивные элементы
5. **Accessibility** - сохранены все исходные ссылки и кнопки

## 🔒 Edge Cases Handled

1. **Nested links** - `closest('a')` игнорирует вложенные ссылки
2. **Buttons** - `closest('button')` игнорирует все кнопки
3. **Role buttons** - `closest('[role="button"]')` для custom кнопок
4. **Swiper buttons** - игнорирование классов `.swiper-button-*`
5. **Data attribute** - `data-no-redirect="true"` для custom элементов
6. **Event bubbling** - правильное использование `stopPropagation()`

## 📝 Usage Example

### Default behavior:
```tsx
// Клик по тексту → /posts/123
<PostCard post={post} />
```

### Disable click navigation (if needed):
```tsx
// Добавить data-no-redirect на элемент
<div data-no-redirect="true">
  Этот элемент не будет переходить
</div>
```

## 🚀 Future Enhancements

- [ ] Keyboard navigation (Enter key)
- [ ] Right-click context menu
- [ ] Swipe gesture для перехода
- [ ] Accessibility: ARIA labels
- [ ] Analytics tracking для кликов

## ✅ Checklist

- [x] Клик по карточке работает
- [x] Клик по тексту работает
- [x] Игнорирование аватара
- [x] Игнорирование dropdown
- [x] Игнорирование лайков
- [x] Игнорирование комментариев
- [x] Игнорирование медиа слайдера
- [x] Игнорирование кнопок навигации
- [x] Визуальный feedback (shadow)
- [x] Cursor pointer
- [x] Transition анимация
- [x] Без TypeScript ошибок

## 🎉 Result

Теперь пользователь может кликнуть по любой части карточки поста (текст, фон, пустое место), чтобы перейти на страницу отдельного поста. Все интерактивные элементы (аватар, dropdown, лайки, медиа) продолжают работать как раньше!
