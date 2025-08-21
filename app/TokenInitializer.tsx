"use client";
import { useEffect } from 'react'
import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { setToken } from '@/src/store/user/user.slice'

export default function TokenInitializer() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Читаем токен из cookie при загрузке приложения
        if (typeof window !== 'undefined') {
            const tokenFromCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1]

            const tokenFromLocalStorage = localStorage.getItem('token')
            const finalToken = tokenFromCookie || tokenFromLocalStorage

            console.log('[TokenInitializer] Cookie token:', !!tokenFromCookie)
            console.log('[TokenInitializer] LocalStorage token:', !!tokenFromLocalStorage)
            console.log('[TokenInitializer] Final token:', !!finalToken)

            if (finalToken) {
                dispatch(setToken(finalToken))
                // Синхронизируем cookie и localStorage
                if (tokenFromLocalStorage && !tokenFromCookie) {
                    // Если токен только в localStorage - записываем в cookie
                    const expires = new Date()
                    expires.setDate(expires.getDate() + 7)
                    document.cookie = `token=${tokenFromLocalStorage}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
                    console.log('[TokenInitializer] Synced localStorage token to cookie')
                }
            }
        }
    }, [dispatch])

    return null // Этот компонент ничего не рендерит
}
