/**
 * Хук для управления состоянием спойлеров
 * 
 * @module features/post/hooks/useSpoiler
 */

import { useState, useCallback, useEffect } from 'react'
import { SpoilerUtils, type SpoilerConfig } from '../utils/spoiler.utils'

interface UseSpoilerOptions {
  postId: string
  mediaIndex?: number
  initialRevealed?: boolean
  persistState?: boolean
  config?: SpoilerConfig
}

interface UseSpoilerReturn {
  isRevealed: boolean
  toggle: () => void
  reveal: () => void
  hide: () => void
  config: Required<SpoilerConfig>
}

/**
 * Хук для управления спойлером
 */
export const useSpoiler = ({
  postId,
  mediaIndex,
  initialRevealed = false,
  persistState = false,
  config = {},
}: UseSpoilerOptions): UseSpoilerReturn => {
  const spoilerKey = SpoilerUtils.getSpoilerKey(postId, mediaIndex)

  // Загружаем сохраненное состояние если нужно
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    if (persistState) {
      return SpoilerUtils.loadSpoilerState(spoilerKey)
    }
    return initialRevealed
  })

  // Сохраняем состояние при изменении
  useEffect(() => {
    if (persistState) {
      SpoilerUtils.saveSpoilerState(spoilerKey, isRevealed)
    }
  }, [isRevealed, persistState, spoilerKey])

  const reveal = useCallback(() => {
    setIsRevealed(true)
  }, [])

  const hide = useCallback(() => {
    setIsRevealed(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRevealed((prev) => !prev)
  }, [])

  return {
    isRevealed,
    toggle,
    reveal,
    hide,
    config: {
      blurAmount: config.blurAmount ?? 20,
      showButton: config.showButton ?? true,
      buttonText: config.buttonText ?? 'Показать спойлер',
      revealedText: config.revealedText ?? 'Скрыть спойлер',
      autoRevealOnClick: config.autoRevealOnClick ?? true,
    },
  }
}

/**
 * Хук для управления множественными спойлерами (для медиа галереи)
 */
export const useMultipleSpoilers = (
  postId: string,
  mediaCount: number,
  spoilerIndices: number[] = []
) => {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    new Set()
  )

  const revealMedia = useCallback((index: number) => {
    setRevealedIndices((prev) => new Set(prev).add(index))
  }, [])

  const hideMedia = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })
  }, [])

  const toggleMedia = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const revealAll = useCallback(() => {
    setRevealedIndices(new Set(spoilerIndices))
  }, [spoilerIndices])

  const hideAll = useCallback(() => {
    setRevealedIndices(new Set())
  }, [])

  const isMediaRevealed = useCallback(
    (index: number): boolean => {
      return revealedIndices.has(index) || !spoilerIndices.includes(index)
    },
    [revealedIndices, spoilerIndices]
  )

  return {
    isMediaRevealed,
    revealMedia,
    hideMedia,
    toggleMedia,
    revealAll,
    hideAll,
    revealedCount: revealedIndices.size,
    totalSpoilers: spoilerIndices.length,
  }
}
