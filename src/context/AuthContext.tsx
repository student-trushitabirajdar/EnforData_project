import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient, SignupRequest } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: SignupRequest) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session and validate with backend
    const initializeAuth = async () => {
      const token = localStorage.getItem('enfor_token');
      if (token) {
        try {
          const response = await apiClient.getMe();
          const backendUser = response.data;
          
          if (backendUser) {
            // Convert backend user format to frontend User type
            const user: User = {
              id: backendUser.id,
              email: backendUser.email,
              name: `${backendUser.first_name} ${backendUser.last_name}`,
              phone: '', // Will be populated from backend if needed
              role: backendUser.role as 'broker' | 'channel_partner' | 'admin',
              city: backendUser.city,
              state: backendUser.state,
              company_name: backendUser.firm_name,
              is_verified: backendUser.is_verified,
              created_at: backendUser.created_at,
              updated_at: backendUser.created_at // Backend doesn't return updated_at in this response
            };
          
            setUser(user);
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('enfor_token');
          localStorage.removeItem('enfor_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.login({ email, password });
      const authData = response.data;
      
      if (!authData) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user: backendUser } = authData;
      
      // Store token
      localStorage.setItem('enfor_token', token);
      
      // Convert backend user format to frontend User type
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.first_name} ${backendUser.last_name}`,
        phone: '', // Will be populated from backend if needed
        role: backendUser.role as 'broker' | 'channel_partner' | 'admin',
        city: backendUser.city,
        state: backendUser.state,
        company_name: backendUser.firm_name,
        is_verified: backendUser.is_verified,
        created_at: backendUser.created_at,
        updated_at: backendUser.created_at
      };
      
      setUser(user);
      localStorage.setItem('enfor_user', JSON.stringify(user));
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('enfor_token');
      localStorage.removeItem('enfor_user');
    }
  };

  const register = async (userData: SignupRequest): Promise<void> => {
    try {
      const response = await apiClient.signup(userData);
      const authData = response.data;
      
      if (!authData) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user: backendUser } = authData;
      
      // Store token
      localStorage.setItem('enfor_token', token);
      
      // Convert backend user format to frontend User type
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: `${backendUser.first_name} ${backendUser.last_name}`,
        phone: '', // Will be populated from backend if needed
        role: backendUser.role as 'broker' | 'channel_partner' | 'admin',
        city: backendUser.city,
        state: backendUser.state,
        company_name: backendUser.firm_name,
        is_verified: backendUser.is_verified,
        created_at: backendUser.created_at,
        updated_at: backendUser.created_at
      };
      
      setUser(user);
      localStorage.setItem('enfor_user', JSON.stringify(user));
    } catch (error) {
      throw error; // Re-throw to let the component handle the error
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};