import { useState, useCallback, useRef } from 'react'

/**
 * Debounce hook для предотвращения спама кликов
 * @param callback - функция для выполнения
 * @param delay - задержка в миллисекундах
 * @returns debouncedCallback и состояние isPending
 */
export function useDebounceAntiSpam<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
) {
  const [isPending, setIsPending] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setIsPending(true)

      timeoutRef.current = setTimeout(() => {
        callback(...args)
        setIsPending(false)
      }, delay)
    },
    [callback, delay]
  )

  return { debouncedCallback, isPending }
}

/**
 * Throttle hook для ограничения частоты вызовов
 * @param callback - функция для выполнения
 * @param limit - минимальный интервал между вызовами в мс
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 1000
) {
  const [isThrottled, setIsThrottled] = useState(false)
  const lastRun = useRef<number>(Date.now())

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastRun.current >= limit) {
        callback(...args)
        lastRun.current = now
        setIsThrottled(false)
      } else {
        setIsThrottled(true)
      }
    },
    [callback, limit]
  )

  return { throttledCallback, isThrottled }
}

/**
 * Hook для предотвращения дублирующихся запросов
 */
export function usePreventDuplicate<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T
) {
  const [isProcessing, setIsProcessing] = useState(false)
  const lastCallArgs = useRef<string>('')

  const wrappedFunction = useCallback(
    async (...args: Parameters<T>) => {
      // Проверяем, не выполняется ли уже запрос
      if (isProcessing) {
        console.warn('Запрос уже выполняется')
        return
      }

      // Проверяем, не повторяется ли запрос с теми же аргументами
      const argsKey = JSON.stringify(args)
      if (lastCallArgs.current === argsKey) {
        console.warn('Дублирующий запрос заблокирован')
        return
      }

      setIsProcessing(true)
      lastCallArgs.current = argsKey

      try {
        const result = await asyncFunction(...args)
        return result
      } catch (error) {
        throw error
      } finally {
        setIsProcessing(false)
        // Сбрасываем lastCallArgs через 3 секунды
        setTimeout(() => {
          lastCallArgs.current = ''
        }, 3000)
      }
    },
    [asyncFunction, isProcessing]
  )

  return { wrappedFunction, isProcessing }
}
