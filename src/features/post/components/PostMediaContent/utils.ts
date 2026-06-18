import type { PostMedia } from "./types";

// Высота одиночного медиа ограничена через Tailwind-классы (responsive из коробки,
// не пересчитывается в JS и не ломается при ресайзе/открытии DevTools).
export const SINGLE_MEDIA_MAX_HEIGHT_CLASSES = "max-h-[35vh] sm:max-h-[55vh]";

/**
 * Стиль контейнера для одиночного медиа.
 *
 * Идея: aspectRatio резервирует пропорции СРАЗУ при первом рендере (ещё до того,
 * как картинка/видео успели загрузиться), поэтому браузер не делает reflow,
 * когда контент догружается. Высота при этом всё равно ограничена сверху
 * через max-h-[..vh] классы на самом контейнере — так на маленьких экранах
 * медиа не растягивается на весь viewport.
 *
 * width: "auto" + maxWidth: "100%" — чтобы контейнер не растягивался на всю
 * ширину карточки, а обтягивал контент по факту (как было до рефакторинга).
 */
export const getSingleMediaContainerStyle = (
  item: Pick<PostMedia, "width" | "height">,
): React.CSSProperties => {
  if (item.width && item.height) {
    return {
      aspectRatio: `${item.width} / ${item.height}`,
      width: "auto",
      maxWidth: "100%",
    };
  }

  // Нет width/height с бэкенда — используем безопасный фоллбэк,
  // чтобы контейнер не схлопывался в 0px до загрузки контента.
  return {
    height: 300,
    width: "auto",
    maxWidth: "100%",
  };
};
