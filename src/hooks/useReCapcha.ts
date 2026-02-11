'use client'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useCallback, useState } from 'react'

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyRecaptcha = useCallback(
    async (action: string = 'submit') => {
      if (!executeRecaptcha) {
        console.warn('reCAPTCHA not loaded yet')
        return null
      }

      setIsVerifying(true)
      try {
        const token = await executeRecaptcha(action)
        return token
      } catch (error) {
        console.error('reCAPTCHA verification failed:', error)
        return null
      } finally {
        setIsVerifying(false)
      }
    },
    [executeRecaptcha]
  )

  return { verifyRecaptcha, isVerifying }
}