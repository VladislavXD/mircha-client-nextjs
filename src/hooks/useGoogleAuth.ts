"use client"

import { useAppDispatch } from '@/src/hooks/reduxHooks'
import { setToken, setUser } from '@/src/store/user/user.slice'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useGoogleAuth() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleGoogleLogin = async () => {
      if (status === 'authenticated' && session?.user && session.user.provider === 'google') {
        try {
          // Вызываем наш API для получения токена от Express API
          const response = await fetch('/api/auth/google-callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              avatarUrl: session.user.image,
              googleId: session.user.googleId,
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to get token from Express API')
          }

          const { user, token } = await response.json()

          // Сохраняем токен и пользователя в Redux
          dispatch(setToken(token))
          dispatch(setUser(user))

          // Сохраняем токен в localStorage
          localStorage.setItem('token', token)
          
          // Сохраняем в cookie для middleware
          const expires = new Date()
          expires.setDate(expires.getDate() + 7)
          document.cookie = `token=${token}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`

          console.log('[Google Auth] Token saved successfully')
        } catch (error) {
          console.error('[Google Auth] Error:', error)
        }
      }
    }

    handleGoogleLogin()
  }, [session, status, dispatch])

  return { session, status }
}
