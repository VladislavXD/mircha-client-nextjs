import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { feedbackService } from '../services/feedback.service'
import type { Feedback, CreateFeedbackDto } from '../types'

/**
 * Hook для отправки жалобы или обратной связи
 */
export function useCreateFeedback(
  options?: Omit<UseMutationOptions<Feedback, Error, CreateFeedbackDto>, 'mutationFn'>
) {
  return useMutation<Feedback, Error, CreateFeedbackDto>({
    mutationFn: (data: CreateFeedbackDto) => feedbackService.createFeedback(data),
    
    onSuccess: () => {
      toast.success('Ваше сообщение отправлено!')
    },
    
    onError: (error) => {
      toast.error(error.message || 'Ошибка при отправке')
      console.error('Feedback error:', error)
    },
    
    ...options
  })
}
