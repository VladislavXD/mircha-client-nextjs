"use client"
import React from 'react'
import { useCurrentQuery } from '@/src/services/user/user.service'
import { Spinner } from '@heroui/react'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
   
    return <>{children}</>
}

export default AuthGuard
