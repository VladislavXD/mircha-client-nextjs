/**
 * Типы медиа файлов для постов
 * 
 * @module features/post/types/media
 */

/**
 * Тип медиа файла
 */
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
}

/**
 * Интерфейс медиа файла
 */
export interface MediaFile {
  id: string
  url: string
  publicId: string
  previewUrl?: string
  name?: string
  size?: number
  mimeType: string
  type: MediaType
  width?: number
  height?: number
  duration?: number
  spoiler: boolean
  nsfw: boolean
  postId?: string
  threadId?: string
  replyId?: string
  createdAt: string
}

/**
 * DTO для медиа файла при создании
 */
export interface MediaFileDto {
  buffer?: Buffer
  originalname?: string
  mimetype?: string
  size?: number
  spoiler?: boolean
}

/**
 * Данные медиа для превью (на клиенте)
 */
export interface MediaPreviewData {
  file: File
  preview: string
  type: 'image' | 'video'
  id: string
}

/**
 * Конфигурация ограничений для медиа
 */
export interface MediaLimits {
  maxImages: number
  maxVideos: number
  maxImageSize: number
  maxVideoSize: number
  allowedImageFormats: string[]
  allowedVideoFormats: string[]
}

/**
 * Дефолтные лимиты медиа
 */
export const DEFAULT_MEDIA_LIMITS: MediaLimits = {
  maxImages: 20,
  maxVideos: 10,
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  allowedImageFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoFormats: ['video/mp4', 'video/webm', 'video/ogg'],
}

/**
 * Вспомогательные функции для работы с медиа
 */
export const MediaUtils = {
  /**
   * Проверка, является ли файл изображением
   */
  isImage: (mimeType: string): boolean => {
    return mimeType.startsWith('image/')
  },

  /**
   * Проверка, является ли файл видео
   */
  isVideo: (mimeType: string): boolean => {
    return mimeType.startsWith('video/')
  },

  /**
   * Получение типа медиа из MIME типа
   */
  getMediaType: (mimeType: string): MediaType => {
    if (mimeType === 'image/gif') return MediaType.GIF
    if (mimeType.startsWith('video/')) return MediaType.VIDEO
    return MediaType.IMAGE
  },

  /**
   * Форматирование размера файла
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  },

  /**
   * Проверка размера файла
   */
  validateFileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize
  },

  /**
   * Проверка формата файла
   */
  validateFileFormat: (file: File, allowedFormats: string[]): boolean => {
    return allowedFormats.includes(file.type)
  },
}
