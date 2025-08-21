"use client";
import { useAppSelector } from '@/src/hooks/reduxHooks';
import { selectIsAuthenticated } from '@/src/store/user/user.slice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const token = useAppSelector(state => state.user.token)

  console.log('[AuthLayout] isAuthenticated:', isAuthenticated, 'token:', !!token);

  useEffect(() => {
    console.log('[AuthLayout] useEffect triggered, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('[AuthLayout] Redirecting to home because user is authenticated');
      router.push("/")
    }
  }, [isAuthenticated, router])

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {children}
    </div>
  );
}
