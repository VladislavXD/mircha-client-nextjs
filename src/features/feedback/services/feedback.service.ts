import type { Feedback, CreateFeedbackDto } from '../types'

/**
 * Feedback Service - API для отправки жалоб и обратной связи в Telegram
 * Использует Next.js API Route вместо внешнего backend
 */
class FeedbackService {
  /**
   * Отправить жалобу или обратную связь
   * Отправляет данные на /api/feedback который пересылает в Telegram
   */
  async createFeedback(data: CreateFeedbackDto & { userName?: string; userEmail?: string }): Promise<Feedback> {
    const formData = new FormData()
    
    formData.append('type', data.type)
    formData.append('subject', data.subject)
    formData.append('description', data.description)
    
    if (data.reason) {
      formData.append('reason', data.reason)
    }
    
    if (data.targetId) {
      formData.append('targetId', data.targetId)
    }
    
    if (data.targetType) {
      formData.append('targetType', data.targetType)
    }
    
    if (data.userName) {
      formData.append('userName', data.userName)
    }
    
    if (data.userEmail) {
      formData.append('userEmail', data.userEmail)
    }
    
    if (data.screenshot) {
      formData.append('screenshot', data.screenshot)
    }
    
    // Используем нативный fetch для отправки на Next.js API Route
    const response = await fetch('/api/feedback', {
      method: 'POST',
      body: formData,
      // НЕ указываем Content-Type - браузер сам установит с boundary для multipart/form-data
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }))
      throw new Error(error.error || error.message || 'Не удалось отправить жалобу')
    }

    return response.json()
  }
}

export const feedbackService = new FeedbackService()
