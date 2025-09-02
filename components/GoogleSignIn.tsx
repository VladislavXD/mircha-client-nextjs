"use client"

import { Button } from "@heroui/react"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

interface GoogleSignInProps {
  isLoading?: boolean
}

export default function GoogleSignIn({ isLoading = false }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <Button
      variant="bordered"
      startContent={<FcGoogle size={20} />}
      onPress={handleGoogleSignIn}
      isLoading={isLoading}
      isDisabled={isLoading}
      className="w-full"
    >
      Войти через Google
    </Button>
  )
}
