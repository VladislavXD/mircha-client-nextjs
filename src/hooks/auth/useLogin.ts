import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/src/services/auth/auth.api'
import { saveToStorage } from '@/src/services/auth/auth.helper'
import { userKeys } from '@/src/services/user/user.keys'
import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { setToken } from '@/src/store/user/user.slice'
import type { IAuthUser } from '@/src/services/user/user.interface'

/**
 * React Query хук для логина
 * 
 * @example
 * const { mutate: login, isPending } = useLogin()
 * login({ email, password, recaptchaToken })
 */
export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: loginUser,
    
    onSuccess: (data) => {
      console.log('Login success - full data:', data)
      
      // Проверяем что данные корректны
      if (!data || !data.token || !data.user) {
        console.error('Invalid login response:', data)
        throw new Error('Некорректный ответ от сервера')
      }
      
      console.log('Login success:', { 
        token: data.token ? 'exists' : 'none', 
        user: data.user.email,
        fullUser: data.user 
      })
      
      // 1. Сохраняем в cookies и localStorage
      saveToStorage(data)
      
      // 2. Обновляем Redux state (setToken принимает { token, user })
      dispatch(setToken({ 
        token: data.token, 
        user: {
          email: data.user.email,
          role: data.user.role || 'USER'
        }
      }))
      
      // 3. Инвалидируем кеш текущего пользователя
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      
      // 4. Редирект на главную
      router.push('/')
    },
    
    onError: (error: any) => {
      console.error('Login failed:', error)
    }
  })
}
