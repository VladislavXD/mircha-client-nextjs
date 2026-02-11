# Rich Text Formatting Implementation

## 📋 Overview

Реализована полная поддержка форматирования текста (rich text) в постах с интеграцией спойлеров.

## 🎯 Features

### Форматирование текста:
- ✅ **Bold** (Жирный)
- ✅ **Italic** (Курсив)
- ✅ **Underline** (Подчеркнутый)
- ✅ **Strikethrough** (Зачеркнутый)
- ✅ **Highlight** (Подсветка) - с автоотключением при пробеле

### Интеграция:
- ✅ Работает с эмодзи
- ✅ Работает с упоминаниями (@mentions)
- ✅ Работает со спойлерами
- ✅ Поддержка вложенного форматирования

## 📁 Modified Files

### 1. **CreatePost.tsx** (`client-next/src/features/post/components/CreatePost.tsx`)
- Добавлена панель инструментов с 5 кнопками форматирования
- `applyFormat()` - применение/отключение форматов
- `updateActiveFormats()` - отслеживание активных форматов
- `handleKeyDown()` - автоотключение подсветки при пробеле
- `serializeDOM()` - сохранение HTML тегов
- `renderToDOM()` - восстановление HTML тегов

### 2. **parseEmojiText.ts** (`client-next/app/utils/parseEmojiText.ts`)
- Расширен тип `EmojiTextSegment` с новыми типами: `bold`, `italic`, `underline`, `strikethrough`, `highlight`
- Парсинг HTML тегов: `<b>`, `<i>`, `<u>`, `<s>`, `<mark>`
- Рекурсивная обработка вложенных элементов

### 3. **EmojiText/index.tsx** (`client-next/shared/components/ui/EmojiText/index.tsx`)
- Новый компонент `SegmentRenderer` для рекурсивного рендеринга
- Обновлен `SpoilerSegment` для использования `SegmentRenderer`
- Рендеринг всех типов форматирования

## 🔧 Technical Details

### HTML Tags Format:
```typescript
<b>bold</b>
<i>italic</i>
<u>underline</u>
<s>strikethrough</s>
<mark>highlight</mark>
```

### Data Flow:

**Editor → Backend:**
```
User input → contentEditable → document.execCommand → 
serializeDOM → String with HTML tags → API
```

**Backend → Display:**
```
API → String with HTML tags → parseEmojiText → 
AST → SegmentRenderer → React elements
```

### Highlight Auto-Disable:
```typescript
// При нажатии пробела:
1. Обнаруживаем <mark> элемент
2. Разделяем текст на две части (до и после пробела)
3. До пробела: остается <mark>
4. После пробела: обычный текст
5. Курсор перемещается после пробела
```

## 🎨 Styling

### Highlight Color:
```css
background-color: rgba(255, 235, 59, 0.3);
color: inherit;
```

### Button States:
- Активная кнопка: синий цвет (`text-primary`)
- Неактивная: серый цвет (`text-default-500`)

## 🧪 Testing Examples

### Basic:
```
<b>Bold text</b>
<i>Italic text</i>
<mark>Highlighted</mark>
```

### With Emoji:
```
<b>Hello [emoji:0]</b>
```

### With Mentions:
```
<mark>Check this [mention:123|User]</mark>
```

### With Spoilers:
```
[spoiler]<b>Bold</b> and <mark>highlighted</mark>[/spoiler]
```

### Complex:
```
Normal <b>bold <i>bold+italic</i></b> [emoji:0] [mention:123|User] and [spoiler]<mark>secret</mark>[/spoiler]
```

## 📊 Performance

- Рекурсивный парсинг оптимизирован для небольших текстов (посты)
- `useMemo` используется для кеширования парсинга
- Ленивая загрузка emoji изображений (`loading="lazy"`)

## 🔒 Security

- Используется только ограниченный набор HTML тегов
- Не используется `dangerouslySetInnerHTML`
- Все теги обрабатываются вручную через React элементы

## 🐛 Known Issues

None at the moment.

## 📝 Future Improvements

- [ ] Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
- [ ] Color picker for highlights
- [ ] Markdown syntax support
- [ ] Formatting in comments
- [ ] Undo/Redo for formatting

## 👥 Usage

### For Users:
1. Выделите текст в редакторе
2. Нажмите кнопку форматирования
3. Для highlight: нажмите пробел для автоотключения

### For Developers:
```typescript
// Создание форматированного текста программно:
const formattedText = "<b>Bold</b> and <mark>highlighted</mark>";

// Рендеринг:
<EmojiText text={formattedText} emojiUrls={emojiUrls} />
```

## 🔗 Related Files

- `CreatePost.tsx` - Редактор
- `PostCard.tsx` - Отображение постов
- `EmojiText/index.tsx` - Рендеринг текста
- `parseEmojiText.ts` - Парсер
- `spoiler.css` - Стили спойлеров

## ✅ Checklist

- [x] Парсинг HTML тегов
- [x] Рендеринг форматирования
- [x] Интеграция с эмодзи
- [x] Интеграция с упоминаниями
- [x] Интеграция со спойлерами
- [x] Автоотключение подсветки
- [x] Toggle форматов
- [x] Вложенное форматирование
- [x] Сериализация в строку
- [x] Десериализация из строки
