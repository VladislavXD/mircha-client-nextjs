# Медиа-слайдер в форме создания поста

## Что изменилось

### ✅ Реализовано

1. **Кнопка загрузки медиа** — стилизована как `EmojiPicker` (круглая иконка с Popover)
2. **Множественная загрузка** — до 30 файлов (фото + видео)
3. **Медиа-слайдер** — горизонтальный скролл с превью
4. **Типы файлов**:
   - Фото: JPEG, PNG, GIF, WebP (макс. 10MB)
   - Видео: MP4, WebM, OGG (макс. 100MB)
5. **Управление**:
   - Удаление файлов по клику на крестик
   - Индикатор типа (Фото/Видео)
   - Счётчик файлов (N / 30)

### 🗑️ Удалено

- Старый компонент `ImageUpload`
- Preview блок поста (форматирование показывается в редакторе)
- Состояния `selectedImage`, `imagePreview`

## Компоненты

### `MediaPreviewSlider.tsx`

```tsx
type MediaFile = {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
};

<MediaPreviewSlider
  media={mediaFiles}
  onRemove={handleRemoveMedia}
  disabled={isLoading}
/>
```

**Features:**
- Горизонтальный скролл (overflow-x-auto)
- Превью 160x160px с rounded-xl
- Кнопка удаления (Hero UI Button с IconOnly)
- Индикатор типа файла внизу слева
- Hover-эффект на границе (border-primary)

### Кнопка загрузки

```tsx
<Popover placement="bottom-start">
  <PopoverTrigger>
    <Button isIconOnly variant="flat" className="rounded-full">
      <IoMdImage size={20} />
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <label>Фото и видео ({count}/{MAX_MEDIA})</label>
    <input type="file" multiple accept="..." />
  </PopoverContent>
</Popover>
```

## Использование

### Загрузка файлов

1. Нажмите на иконку 📷 (рядом с emoji)
2. Выберите файлы (можно несколько)
3. Файлы появятся в слайдере под редактором
4. Макс. 30 файлов

### Удаление файлов

- Нажмите на крестик ✕ в правом верхнем углу превью

### Ограничения

- **Фото**: макс. 10MB, форматы: JPEG, PNG, GIF, WebP
- **Видео**: макс. 100MB, форматы: MP4, WebM, OGG
- **Всего**: до 30 файлов

## API отправки

```ts
const formData = new FormData();
formData.append("content", postContent);

// Пока отправляем только первое изображение (для совместимости)
const firstImage = mediaFiles.find((m) => m.type === "image");
if (firstImage) {
  formData.append("image", firstImage.file);
}
```

**TODO (будущее):**
- Отправка всех файлов: `formData.append("media[]", file)`
- Поддержка множественных файлов на бэкенде

## Стили

### Слайдер

```css
.flex.gap-3.overflow-x-auto.pb-2
.scrollbar-thin.scrollbar-thumb-default-300
```

### Превью

```css
.w-40.h-40.rounded-xl
.border-2.border-default-200
.hover:border-primary
```

### Индикатор

```css
.absolute.bottom-2.left-2
.px-2.py-0.5.rounded-md
.bg-black/70.text-white.text-xs
```

## Troubleshooting

### Файлы не загружаются

**Проверьте:**
- Не достигнут ли лимит 30 файлов
- Размер файла не превышает 10MB (фото) / 100MB (видео)
- Формат поддерживается

### Слайдер не скроллится

**Решение:**
Убедитесь, что в `MediaPreviewSlider` есть класс `overflow-x-auto`

### Preview не удаляются из памяти

**Проверьте:**
`useEffect` с cleanup вызывает `URL.revokeObjectURL()` для каждого файла
