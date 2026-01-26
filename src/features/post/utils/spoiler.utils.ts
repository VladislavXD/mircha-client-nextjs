/**
 * Утилиты для работы со спойлерами
 * 
 * @module features/post/utils/spoiler
 */

/**
 * Состояние раскрытия спойлера
 */
export interface SpoilerState {
  isRevealed: boolean
  toggle: () => void
  reveal: () => void
  hide: () => void
}

/**
 * Конфигурация спойлера
 */
export interface SpoilerConfig {
  blurAmount?: number
  showButton?: boolean
  buttonText?: string
  revealedText?: string
  autoRevealOnClick?: boolean
}

/**
 * Дефолтная конфигурация спойлера
 */
export const DEFAULT_SPOILER_CONFIG: Required<SpoilerConfig> = {
  blurAmount: 20,
  showButton: true,
  buttonText: 'Показать спойлер',
  revealedText: 'Скрыть спойлер',
  autoRevealOnClick: true,
}

/**
 * CSS классы для спойлеров
 */
export const SPOILER_CLASSES = {
  hidden: 'blur-xl select-none pointer-events-none',
  revealed: 'blur-none',
  transition: 'transition-all duration-300 ease-in-out',
  overlay: 'absolute inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center',
  button: 'px-4 py-2 bg-default-900/80 text-white rounded-lg hover:bg-default-900 transition-colors',
} as const

/**
 * Утилиты для работы со спойлерами
 */
export const SpoilerUtils = {
  /**
   * Генерация CSS класса для скрытого контента
   */
  getHiddenClasses: (config: SpoilerConfig = {}): string => {
    const { blurAmount = DEFAULT_SPOILER_CONFIG.blurAmount } = config
    return `blur-[${blurAmount}px] select-none pointer-events-none ${SPOILER_CLASSES.transition}`
  },

  /**
   * Генерация CSS класса для раскрытого контента
   */
  getRevealedClasses: (): string => {
    return `${SPOILER_CLASSES.revealed} ${SPOILER_CLASSES.transition}`
  },

  /**
   * Проверка, нужно ли показывать спойлер
   */
  shouldShowSpoiler: (
    contentSpoiler: boolean,
    mediaSpoiler: boolean,
    userPreferences?: { showSpoilers?: boolean }
  ): boolean => {
    if (userPreferences?.showSpoilers === false) {
      return false
    }
    return contentSpoiler || mediaSpoiler
  },

  /**
   * Получение текста кнопки в зависимости от состояния
   */
  getButtonText: (
    isRevealed: boolean,
    config: SpoilerConfig = {}
  ): string => {
    const {
      buttonText = DEFAULT_SPOILER_CONFIG.buttonText,
      revealedText = DEFAULT_SPOILER_CONFIG.revealedText,
    } = config
    return isRevealed ? revealedText : buttonText
  },

  /**
   * Создание уникального ключа для сохранения состояния спойлера
   */
  getSpoilerKey: (postId: string, mediaIndex?: number): string => {
    return mediaIndex !== undefined
      ? `spoiler-${postId}-media-${mediaIndex}`
      : `spoiler-${postId}-content`
  },

  /**
   * Сохранение состояния спойлера в localStorage
   */
  saveSpoilerState: (key: string, isRevealed: boolean): void => {
    try {
      localStorage.setItem(key, JSON.stringify(isRevealed))
    } catch (error) {
      console.error('Failed to save spoiler state:', error)
    }
  },

  /**
   * Загрузка состояния спойлера из localStorage
   */
  loadSpoilerState: (key: string): boolean => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : false
    } catch (error) {
      console.error('Failed to load spoiler state:', error)
      return false
    }
  },

  /**
   * Очистка всех сохраненных состояний спойлеров
   */
  clearAllSpoilerStates: (): void => {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith('spoiler-')
      )
      keys.forEach((key) => localStorage.removeItem(key))
    } catch (error) {
      console.error('Failed to clear spoiler states:', error)
    }
  },
}

/**
 * Типы событий спойлеров
 */
export enum SpoilerEventType {
  REVEAL = 'spoiler:reveal',
  HIDE = 'spoiler:hide',
  TOGGLE = 'spoiler:toggle',
}

/**
 * Данные события спойлера
 */
export interface SpoilerEvent {
  type: SpoilerEventType
  postId: string
  mediaIndex?: number
  isRevealed: boolean
  timestamp: number
}
