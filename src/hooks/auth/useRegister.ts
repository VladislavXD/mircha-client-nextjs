import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerUser } from '@/src/services/auth/auth.api'
import { saveToStorage } from '@/src/services/auth/auth.helper'
import { userKeys } from '@/src/services/user/user.keys'
import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { setToken } from '@/src/store/user/user.slice'
import type { IAuthUser } from '@/src/services/user/user.interface'

/**
 * React Query хук для регистрации
 * 
 * @example
 * const { mutate: register, isPending } = useRegister()
 * register({ name, email, password, recaptchaToken })
 */
export function useRegister() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: registerUser,
    
    onSuccess: (data) => {
      console.log('Register success:', { token: data.token ? 'exists' : 'none', user: data.user?.email })
      
      // 1. Сохраняем в cookies и localStorage
      saveToStorage(data)
      
      // 2. Обновляем Redux state
      dispatch(setToken({ 
        token: data.token, 
        user: {
          email: data.user.email,
          role: data.user.role || 'USER'
        }
      }))
      
      // 3. Инвалидируем кеш текущего пользователя
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
    
    onError: (error: any) => {
      console.error('Register failed:', error)
    }
  })
}
