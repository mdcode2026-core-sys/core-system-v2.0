// src/core/auth/useAuth.ts
// Simple auth state hook

import { useAuthContext } from './AuthProvider';

export function useAuth() {
  const { isAuthenticated, isLoading, userId, email, fullName, logout } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    userId,
    email,
    fullName,
    logout,
  };
}
