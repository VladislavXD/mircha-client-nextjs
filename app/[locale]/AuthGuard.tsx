"use client"
import React from 'react'
import { useCurrentUser } from '@/src/hooks/user'
import { Spinner } from '@heroui/react'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
   
    return <>{children}</>
}

export default AuthGuard
