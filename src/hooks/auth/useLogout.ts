import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/src/services/auth/auth.api'
import { userKeys } from '@/src/services/user/user.keys'
import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { logoutAction } from '@/src/store/user/user.slice'

/**
 * React Query хук для выхода из системы
 * 
 * @example
 * const { mutate: logout } = useLogout()
 * logout()
 */
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: logoutUser,
    
    onSuccess: () => {
      console.log('Logout success')
      
      // 1. Очищаем Redux state
      dispatch(logoutAction())
      
      // 2. Очищаем весь кеш React Query
      queryClient.clear()
      
      // 3. Редирект на страницу авторизации
      router.push('/auth')
    },
    
    onError: (error: any) => {
      console.error('Logout failed:', error)
    }
  })
}
