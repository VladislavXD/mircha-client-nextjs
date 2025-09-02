"use client"

import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export default function GoogleAuthHandler() {
  useGoogleAuth()
  return null // Этот компонент ничего не рендерит
}
