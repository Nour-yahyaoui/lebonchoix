// components/auth/auth-initializer.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Mark as initialized after first render
    // The actual auth check happens in useAuth hook
    initialize();
  }, [initialize]);

  return null;
}