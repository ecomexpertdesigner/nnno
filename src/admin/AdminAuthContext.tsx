import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from './types.ts';

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'wg_admin_auth_token';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      if (!token) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setUser(data.user);
            setIsLoading(false);
          }
        } else if (res.status === 404 && token.startsWith('wg_admin_')) {
          // Fallback for static Netlify host
          if (mounted) {
            setUser({
              email: 'waleedghangla@gmail.com',
              role: 'admin',
              name: 'Waleed Ghangla',
            });
            setIsLoading(false);
          }
        } else {
          // Token expired or invalid
          if (mounted) {
            setToken(null);
            setUser(null);
            sessionStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_KEY);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
        if (mounted) {
          if (token.startsWith('wg_admin_')) {
            setUser({
              email: 'waleedghangla@gmail.com',
              role: 'admin',
              name: 'Waleed Ghangla',
            });
          }
          setIsLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          sessionStorage.setItem(TOKEN_KEY, data.token);
          return { success: true };
        }
        return { success: false, error: data.error || 'Authentication failed' };
      }

      // Static host fallback (e.g. Netlify deployment without Node.js backend)
      if (res.status === 404 || !res.ok) {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'waleedghangla@gmail.com' && password === 'WGMediaAdmin2026!') {
          const fallbackToken = 'wg_admin_token_' + Date.now();
          const fallbackUser: AdminUser = {
            email: 'waleedghangla@gmail.com',
            role: 'admin',
            name: 'Waleed Ghangla',
          };
          setToken(fallbackToken);
          setUser(fallbackUser);
          sessionStorage.setItem(TOKEN_KEY, fallbackToken);
          return { success: true };
        }
        return { success: false, error: 'Invalid admin credentials' };
      }
    } catch {
      // Network/offline fallback for static deployments
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'waleedghangla@gmail.com' && password === 'WGMediaAdmin2026!') {
        const fallbackToken = 'wg_admin_token_' + Date.now();
        const fallbackUser: AdminUser = {
          email: 'waleedghangla@gmail.com',
          role: 'admin',
          name: 'Waleed Ghangla',
        };
        setToken(fallbackToken);
        setUser(fallbackUser);
        sessionStorage.setItem(TOKEN_KEY, fallbackToken);
        return { success: true };
      }
      return { success: false, error: 'Network error connecting to authentication service' };
    }

    return { success: false, error: 'Authentication failed' };
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.warn('Logout network notice:', err);
    } finally {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }

    return response;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
