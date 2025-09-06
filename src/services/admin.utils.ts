/**
 * Утилитарные функции для админ-панели
 */

// Форматирование размера файла
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б'
  
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Форматирование даты для админки
export const formatAdminDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffDays === 1) {
    return 'Вчера'
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад`
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

// Алиас для совместимости
export const formatDate = formatAdminDate

// Получение цвета для роли пользователя
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'text-red-600 bg-red-100'
    case 'MODERATOR':
      return 'text-blue-600 bg-blue-100'
    case 'USER':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Получение текста для роли пользователя
export const getRoleText = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Админ'
    case 'MODERATOR':
      return 'Модератор'
    case 'USER':
      return 'Пользователь'
    default:
      return 'Неизвестно'
  }
}

// Получение цвета для статуса
export const getStatusColor = (isActive: boolean): string => {
  return isActive 
    ? 'text-green-600 bg-green-100' 
    : 'text-red-600 bg-red-100'
}

// Получение текста для статуса
export const getStatusText = (isActive: boolean): string => {
  return isActive ? 'Активен' : 'Заблокирован'
}

// Получение цвета для типа медиа
export const getMediaTypeColor = (type: string): string => {
  switch (type) {
    case 'IMAGE':
      return 'text-blue-600 bg-blue-100'
    case 'VIDEO':
      return 'text-purple-600 bg-purple-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Получение текста для типа медиа
export const getMediaTypeText = (type: string): string => {
  switch (type) {
    case 'IMAGE':
      return 'Изображение'
    case 'VIDEO':
      return 'Видео'
    default:
      return 'Неизвестно'
  }
}

// Валидация форм
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50 && /^[a-zA-Z0-9_]+$/.test(username)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateBoardName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9_]+$/.test(name)
}

export const validateBoardShortName = (shortName: string): boolean => {
  return shortName.length >= 1 && shortName.length <= 5 && /^[a-zA-Z0-9]+$/.test(shortName)
}

// Дебаунс для поиска
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Получение параметров пагинации
export const getPaginationInfo = (page: number, totalPages: number, total: number) => {
  const startItem = (page - 1) * 10 + 1
  const endItem = Math.min(page * 10, total)
  
  return {
    startItem,
    endItem,
    showingText: `Показано ${startItem}-${endItem} из ${total} записей`,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  }
}

// Построение объекта фильтров без пустых значений
export const buildFilters = (filters: Record<string, any>) => {
  const result: Record<string, any> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      result[key] = value
    }
  })
  
  return result
}

// Создание URL для скачивания файла
export const createDownloadUrl = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Копирование текста в буфер обмена
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      return true
    } catch (err) {
      textArea.remove()
      return false
    }
  }
}

// Создание уведомления
export const createNotification = (
  title: string, 
  body: string, 
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) => {
  // Здесь можно интегрировать с библиотекой уведомлений
  // Например, react-hot-toast или react-toastify
  console.log(`[${type.toUpperCase()}] ${title}: ${body}`)
}

// Безопасное парсирование JSON
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// Обработка ошибок API
export const handleApiError = (error: any): string => {
  // RTK Query ошибка
  if (error?.data?.error) {
    return error.data.error
  }
  
  // Ошибка сети
  if (error?.message) {
    return error.message
  }
  
  // Стандартные HTTP ошибки
  if (error?.status) {
    switch (error.status) {
      case 401:
        return 'Не авторизован'
      case 403:
        return 'Доступ запрещен'
      case 404:
        return 'Ресурс не найден'
      case 409:
        return 'Конфликт данных'
      case 500:
        return 'Внутренняя ошибка сервера'
      default:
        return `HTTP ошибка: ${error.status}`
    }
  }
  
  // Резервное сообщение
  return 'Произошла неизвестная ошибка'
}

// Экспорт всех функций для удобства
export const adminUtils = {
  formatFileSize,
  formatAdminDate,
  getRoleColor,
  getRoleText,
  getStatusColor,
  getStatusText,
  getMediaTypeColor,
  getMediaTypeText,
  validateEmail,
  validateUsername,
  validatePassword,
  validateBoardName,
  validateBoardShortName,
  debounce,
  getPaginationInfo,
  buildFilters,
  createDownloadUrl,
  copyToClipboard,
  createNotification,
  safeJsonParse,
  handleApiError,
}
