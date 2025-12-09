import { User } from '@/constants/types';
import { authService } from '@/services/auth.service';
import {
  clearSessionFromStorage,
  loadSessionFromStorage,
  saveSessionToStorage,
} from '@/utils/storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadSessionFromStorage().then((session) => {
      if (session) setUser(session);
    });
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await authService.login(email, password);

      const authenticatedUser: User = {
        email: response.user.email,
        name: response.user.name,
        token: response.token
      };

      setUser(authenticatedUser);
      await saveSessionToStorage(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Error al iniciar sesión" };
    }
  };

  const signOut = () => {
    setUser(null);
    clearSessionFromStorage().catch((error) => {
      console.error('No se pudo limpiar la sesión:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
