import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const API_BASE = 'http://127.0.0.1:5000/api';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  authError: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  // Verify and fetch existing user on initial load
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      })
      .catch((err) => {
        console.error('Failed to authenticate token:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Register recruiter & company
  const register = useCallback(async ({ name, email, password, companyName }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        return { success: true, user: data.user };
      } else {
        setAuthError(data.error || 'Registration failed');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to connect to server. Please try again.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login recruiter
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        return { success: true, user: data.user };
      } else {
        setAuthError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to connect to server. Please try again.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout recruiter
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        authError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
