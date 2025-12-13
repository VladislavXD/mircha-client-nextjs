"use client";
import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { logoutAction } from '@/src/store/user/user.slice'
import { useRouter } from 'next/navigation'

export function useLogout() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const logout = () => {
        // Удаляем токен из Redux и localStorage
        dispatch(logoutAction())
        
        // Удаляем cookie
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        
        // Перенаправляем на страницу авторизации
        router.push('/auth')
    }

    return logout
}
