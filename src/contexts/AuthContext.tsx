import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

export interface User {
  id: string | number;
  email: string;
  name?: string;
  role_id?: number;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  status: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (token: string, userData: User) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  status: null, 
  loading: true, 
  logout: async () => {},
  login: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('azm_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(getApiUrl('/auth'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Map role ID to role name for the UI
          const roleMap: Record<number, string> = {
            1: 'super_admin',
            2: 'content_manager',
            3: 'sales_manager',
            4: 'seo_manager',
            5: 'viewer'
          };
          setRole(roleMap[data.user.role_id] || 'viewer');
          setStatus('active');
        } else {
          localStorage.removeItem('azm_token');
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('azm_token', token);
    setUser(userData);
    const roleMap: Record<number, string> = {
      1: 'super_admin',
      2: 'content_manager',
      3: 'sales_manager',
      4: 'seo_manager',
      5: 'viewer'
    };
    setRole(roleMap[userData.role_id || 5]);
    setStatus('active');
  };

  const logout = async () => {
    localStorage.removeItem('azm_token');
    setUser(null);
    setRole(null);
    setStatus(null);
    try {
      await fetch(getApiUrl('/auth?action=logout'), { method: 'POST' });
    } catch(e) {}
  };

  return (
    <AuthContext.Provider value={{ user, role, status, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
