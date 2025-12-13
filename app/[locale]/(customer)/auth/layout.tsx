"use client";
import { useCurrentUser } from '@/src/hooks/user';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user: currentUser, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/")
    }
  }, [currentUser, isLoading, router])

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {children}
    </div>
  );
}
