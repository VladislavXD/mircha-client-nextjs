/**
 * Утилиты для валидации контента на клиенте
 */

// Проверка на спам-паттерны
export const containsSpam = (text: string): boolean => {
  if (!text) return false

  const spamPatterns = [
    /viagra|cialis|casino|lottery|jackpot/gi,
    /\b(free\s*money|click\s*here|buy\s*now)\b/gi,
    /(http|https):\/\/[^\s]+\.(ru|cn|xyz)/gi,
    /[A-Z]{10,}/, // много заглавных букв
    /(.)\1{10,}/, // повторяющиеся символы
  ]

  return spamPatterns.some(pattern => pattern.test(text))
}

// Валидация длины текста
export const validateTextLength = (
  text: string,
  min: number = 1,
  max: number = 5000
): { valid: boolean; error?: string } => {
  const length = text.trim().length

  if (length < min) {
    return { valid: false, error: `Минимум ${min} символов` }
  }

  if (length > max) {
    return { valid: false, error: `Максимум ${max} символов` }
  }

  return { valid: true }
}

// Валидация поста
export const validatePost = (content: string): { valid: boolean; error?: string } => {
  if (!content || !content.trim()) {
    return { valid: false, error: 'Содержимое поста не может быть пустым' }
  }

  if (containsSpam(content)) {
    return { valid: false, error: 'Обнаружен запрещённый контент' }
  }

  return validateTextLength(content, 1, 5000)
}

// Валидация комментария
export const validateComment = (content: string): { valid: boolean; error?: string } => {
  if (!content || !content.trim()) {
    return { valid: false, error: 'Комментарий не может быть пустым' }
  }

  if (containsSpam(content)) {
    return { valid: false, error: 'Обнаружен запрещённый контент' }
  }

  return validateTextLength(content, 1, 2000)
}

// Валидация имени пользователя
export const validateUsername = (name: string): { valid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Имя не может быть пустым' }
  }

  if (!/^[a-zA-Zа-яА-ЯёЁ0-9_-]+$/.test(name)) {
    return { valid: false, error: 'Недопустимые символы в имени' }
  }

  if (containsSpam(name)) {
    return { valid: false, error: 'Недопустимое имя' }
  }

  return validateTextLength(name, 2, 50)
}

// Валидация биографии
export const validateBio = (bio: string): { valid: boolean; error?: string } => {
  if (containsSpam(bio)) {
    return { valid: false, error: 'Обнаружен запрещённый контент' }
  }

  return validateTextLength(bio, 0, 500)
}

// Проверка на повторяющийся контент
const recentSubmissions = new Map<string, number>()

export const checkDuplicateSubmission = (
  content: string,
  userId: string,
  timeWindowMs: number = 5 * 60 * 1000 // 5 минут
): { isDuplicate: boolean; error?: string } => {
  const key = `${userId}:${content.trim()}`
  const now = Date.now()
  const lastSubmission = recentSubmissions.get(key)

  if (lastSubmission && now - lastSubmission < timeWindowMs) {
    return { 
      isDuplicate: true, 
      error: 'Вы недавно отправляли такое сообщение. Подождите немного' 
    }
  }

  recentSubmissions.set(key, now)

  // Очистка старых записей
  const entries = Array.from(recentSubmissions.entries())
  for (const [k, timestamp] of entries) {
    if (now - timestamp > timeWindowMs) {
      recentSubmissions.delete(k)
    }
  }

  return { isDuplicate: false }
}
