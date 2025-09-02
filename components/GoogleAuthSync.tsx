'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks'
import { setUser, setToken, logout } from '@/src/store/user/user.slice'

export default function GoogleAuthSync() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()
  const { token, current } = useAppSelector(state => state.user)
  
  // Отслеживаем, был ли пользователь авторизован через Google
  const wasGoogleUser = useRef(false)

  useEffect(() => {
    // Если есть сессия Google, но нет токена в Redux
    if (session?.user && !token && status === 'authenticated') {
      wasGoogleUser.current = true
      handleGoogleSync()
    }
    
    // Если пользователь был авторизован через Google и NextAuth сессия закончилась
    if (wasGoogleUser.current && status === 'unauthenticated' && token) {
      // Очищаем Redux store только для Google пользователей
      dispatch(logout())
      wasGoogleUser.current = false
    }
    
    // Обновляем флаг, если текущий пользователь от Google
    if (current?.provider === 'google') {
      wasGoogleUser.current = true
    }
  }, [session, status, token, current])

  const handleGoogleSync = async () => {
    try {
      const response = await fetch('/api/auth/google-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name,
          avatarUrl: session?.user?.image,
          googleId: session?.user?.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Сохраняем токен и пользователя в Redux
        dispatch(setToken(data.token))
        dispatch(setUser(data.user))
        
        // Сохраняем токен в localStorage для API запросов
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
      }
    } catch (error) {
      console.error('Google sync error:', error)
    }
  }

  return null // Этот компонент не рендерит UI
}
