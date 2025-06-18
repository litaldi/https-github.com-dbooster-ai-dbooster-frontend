
import React, { createContext, ReactNode } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthService } from '@/services/authService';
import { AuthContextType } from './auth-types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authService = new AuthService();

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthState();

  const contextValue: AuthContextType = {
    ...authState,
    login: authService.loginWithOAuth.bind(authService),
    loginWithEmail: (email: string, password: string) => 
      authService.loginWithCredentials({ email, password }),
    loginWithPhone: (phone: string, password: string) => 
      authService.loginWithCredentials({ phone, password }),
    signupWithEmail: (email: string, password: string, name: string) => 
      authService.signupWithCredentials({ email, password, name }),
    signupWithPhone: (phone: string, password: string, name: string) => 
      authService.signupWithCredentials({ phone, password, name }),
    signIn: async (identifier: string, password: string) => {
      try {
        if (identifier.includes('@')) {
          await authService.loginWithCredentials({ email: identifier, password });
        } else {
          await authService.loginWithCredentials({ phone: identifier, password });
        }
        return {};
      } catch (error: any) {
        return { error: { message: error.message } };
      }
    },
    signUp: async (userData: any) => {
      try {
        if (userData.email) {
          await authService.signupWithCredentials({
            email: userData.email,
            password: userData.password,
            name: userData.name
          });
        } else {
          await authService.signupWithCredentials({
            phone: userData.phone,
            password: userData.password,
            name: userData.name
          });
        }
        return {};
      } catch (error: any) {
        return { error: { message: error.message } };
      }
    },
    loginDemo: authService.loginDemo.bind(authService),
    logout: () => authService.logout(authState.isDemo)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
