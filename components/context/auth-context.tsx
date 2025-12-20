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
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadSessionFromStorage().then((session) => {
      // Solo restaurar sesión si existe un token válido
      if (session && session.token) {
        setUser(session);
      } else if (session && !session.token) {
        // Limpia sesiones antiguas/invalidas que no tengan token
        clearSessionFromStorage().catch((error) => {
          console.error('No se pudo limpiar una sesión inválida:', error);
        });
      }
      // Marcar que la inicialización está completa
      setIsInitializing(false);
    });
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await authService.login(email, password);

      const authenticatedUser: User = {
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        token: response.token
      };

      setUser(authenticatedUser);
      await saveSessionToStorage(authenticatedUser);
      return { success: true };
    } catch (error: any) {
      //Manejo de JSON inválido/servidor caído
      const message = String(error);

      if (
        message.includes("Unexpected token <") ||
        message.includes("JSON") ||
        message.includes("invalid json") ||
        message.includes("SyntaxError")
      ) {
        return {
          success: false,
          error: "El servidor no responde o devolvió una respuesta inválida."
        };
      }
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
    <AuthContext.Provider value={{ user, isInitializing, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}