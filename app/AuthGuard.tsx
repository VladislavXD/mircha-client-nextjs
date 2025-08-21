"use client"
import React from 'react'
import { useCurrentQuery } from '@/src/services/user/user.service'
import { Spinner } from '@heroui/react'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    // Middleware уже проверил наличие токена в cookie, здесь только загружаем профиль
    const { data: user, isLoading, error } = useCurrentQuery()

    // Показываем спиннер пока загружается профиль
    if (isLoading) {
        return <Spinner className='w-full h-full flex items-center justify-center'/>
    }

    // Если ошибка загрузки профиля - middleware перенаправит на /auth при следующем запросе
    // Пока что просто рендерим children
    return <>{children}</>
}

export default AuthGuard
