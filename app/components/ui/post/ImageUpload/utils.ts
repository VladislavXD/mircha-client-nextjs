import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from './types';

/**
 * Проверяет, является ли файл допустимым изображением
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Проверка типа файла
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP)'
    };
  }

  // Проверка размера файла
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Файл слишком большой. Максимальный размер: 5MB'
    };
  }

  return { isValid: true };
};

/**
 * Создает URL для предпросмотра изображения
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Освобождает память, занятую URL предпросмотра
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Создает FormData с контентом и изображением для отправки на сервер
 */
export const createPostFormData = (content: string, image?: File): FormData => {
  const formData = new FormData();
  formData.append('content', content);
  
  if (image) {
    formData.append('image', image);
  }
  
  return formData;
};
