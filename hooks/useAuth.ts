// hooks/useAuth.ts
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();
  const hasChecked = useRef(false);

  // Check session on mount - only once
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        
        console.log('Session check result:', data);
        
        if (data.user) {
          store.setUser(data.user, data.token);
        } else {
          store.initialize();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        store.initialize();
      }
    };

    checkSession();
  }, []); // Empty dependency array - run once

  const login = async (email: string, password: string) => {
    store.setLoading(true);
    try {
      console.log('Login attempt for:', email);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      store.setUser(data.user, data.token);
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    store.setLoading(true);
    try {
      console.log('Register attempt for:', email);
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      console.log('Register response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      store.setUser(data.user, data.token);
      return data.user;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      store.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user: store.user,
    isAuthenticated: !!store.user,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    login,
    register,
    logout,
  };
}