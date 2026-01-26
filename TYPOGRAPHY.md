# Typography Implementation

## 📝 Overview

Добавлен литературный serif шрифт **Lora** для текста постов, создающий более элегантный и читабельный вид.

## 🎨 Fonts Used

### 1. **Lora** (Serif - для постов)
- **Использование**: Текст постов (контент)
- **Стили**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Варианты**: Normal, Italic
- **Поддержка**: Latin, Cyrillic (Кириллица)
- **Display**: swap (оптимизация загрузки)
- **Класс**: `font-serif`

### 2. **Inter** (Sans-serif - основной)
- **Использование**: UI элементы, интерфейс
- **Класс**: `font-sans` (default)

### 3. **Fira Code** (Monospace)
- **Использование**: Код, технический текст
- **Класс**: `font-mono`

## 📁 Modified Files

### 1. **fonts.ts** (`src/config/fonts.ts`)
```typescript
import { Lora } from "next/font/google";

export const fontSerif = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
```

### 2. **layout.tsx** (`app/[locale]/layout.tsx`)
```tsx
import { fontSans, fontSerif } from "@/src/config/fonts";

// В body добавлена переменная
className={clsx(
  "min-h-screen text-foreground bg-background font-sans antialiased",
  fontSans.variable,
  fontSerif.variable // ← добавлено
)}
```

### 3. **tailwind.config.js**
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-sans)"],
      mono: ["var(--font-mono)"],
      serif: ["var(--font-serif)"], // ← добавлено
    },
  },
},
```

### 4. **PostCard.tsx**
```tsx
<EmojiText 
  text={safeContent} 
  emojiUrls={emojiUrls} 
  className="font-serif text-[17px] leading-relaxed tracking-wide"
/>
```

### 5. **CreatePost.tsx**
```tsx
<div
  ref={editorRef}
  contentEditable={!isLoading}
  className={
    "outline-none p-4 leading-relaxed text-default-700 " +
    "font-serif text-[17px] tracking-wide " + // ← добавлено
    "..."
  }
/>
```

## 🎯 Typography Scale

### Post Content:
- **Font**: Lora (serif)
- **Size**: 17px
- **Line Height**: relaxed (1.625)
- **Letter Spacing**: wide (0.025em)
- **Color**: text-default-700

### Benefits:
- ✅ Лучшая читабельность длинных текстов
- ✅ Элегантный литературный вид
- ✅ Поддержка кириллицы
- ✅ Отличная поддержка italic для форматирования
- ✅ Google Fonts с оптимизацией (swap)

## 🌍 Language Support

**Lora** поддерживает:
- ✅ Latin (Латиница)
- ✅ Cyrillic (Кириллица) - полная поддержка русского языка
- ✅ Vietnamese (Вьетнамский)

## 🎨 Font Weights Available

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Обычный текст постов |
| 500 | Medium | Акценты в тексте |
| 600 | SemiBold | Полужирный в постах |
| 700 | Bold | `<b>` форматирование |

## 📊 Performance

### Optimization:
- `display: "swap"` - показывает fallback шрифт до загрузки Lora
- Subsets: только нужные символы (latin + cyrillic)
- Next.js автоматически оптимизирует загрузку Google Fonts

### Loading Strategy:
```
1. Показывается fallback (system serif)
2. Lora загружается в фоне
3. Swap на Lora без перерисовки (font-display: swap)
```

## 🎨 Visual Comparison

### Before:
```
Sans-serif (Inter) - более техничный, UI-стиль
"Это текст поста с обычным шрифтом"
```

### After:
```
Serif (Lora) - литературный, элегантный стиль
"Это текст поста с литературным шрифтом"
```

## 🔧 Usage Examples

### In Components:
```tsx
// Применить serif шрифт
<div className="font-serif text-[17px] leading-relaxed">
  Текст поста
</div>

// Применить sans шрифт (по умолчанию)
<div className="font-sans">
  UI элемент
</div>

// Применить mono шрифт
<code className="font-mono">
  const code = "example";
</code>
```

### In Tailwind:
```css
/* Sans (default) */
.font-sans { font-family: var(--font-sans); }

/* Serif (posts) */
.font-serif { font-family: var(--font-serif); }

/* Mono (code) */
.font-mono { font-family: var(--font-mono); }
```

## 🎯 Design Rationale

**Почему Lora?**
1. **Читабельность** - serif шрифты лучше для длинных текстов
2. **Элегантность** - создает атмосферу качественного контента
3. **Кириллица** - отличная поддержка русского языка
4. **Italic** - красивый курсив для форматирования
5. **Google Fonts** - надежная CDN, кеширование

**Альтернативы (если понадобится):**
- Merriweather - более классический serif
- Playfair Display - более декоративный
- PT Serif - русский serif от ParaType

## 🔄 Migration Notes

### Если нужно изменить шрифт:
1. Обновить `src/config/fonts.ts`
2. Изменить import шрифта
3. Обновить конфигурацию (weight, style, subsets)
4. Tailwind автоматически подхватит изменения

### Rollback:
```tsx
// Убрать "font-serif" из className
<EmojiText 
  text={safeContent} 
  emojiUrls={emojiUrls} 
  // className убрать или оставить без font-serif
/>
```

## 📝 Best Practices

1. **Serif для контента** - посты, статьи, длинные тексты
2. **Sans для UI** - кнопки, меню, короткие тексты
3. **Mono для кода** - технические блоки

## ✅ Checklist

- [x] Импорт Lora шрифта
- [x] Добавление в layout
- [x] Конфигурация Tailwind
- [x] Применение в PostCard
- [x] Применение в CreatePost
- [x] Поддержка кириллицы
- [x] Оптимизация загрузки (swap)
- [x] Все весы (400-700)
- [x] Italic поддержка

## 🎨 Typography System Summary

```
┌─────────────────────────────────────┐
│         Typography System           │
├─────────────────────────────────────┤
│ UI Elements     → Inter (Sans)      │
│ Post Content    → Lora (Serif) ✨    │
│ Code Blocks     → Fira Code (Mono)  │
└─────────────────────────────────────┘
```

## 🔗 References

- [Lora on Google Fonts](https://fonts.google.com/specimen/Lora)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Tailwind CSS Custom Fonts](https://tailwindcss.com/docs/font-family)
