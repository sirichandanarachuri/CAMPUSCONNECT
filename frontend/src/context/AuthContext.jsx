import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { logoutUser } from '../services/authService';

const AuthContext = createContext(null);

// Helper to extract access token from possible stored formats (string or JSON string)
function _extractAccessToken(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || t.startsWith('\"{')) {
      try {
        const p = JSON.parse(raw);
        const candidate = p?.access || p?.token || null;
        const jwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        if (typeof candidate === 'string' && jwtLike.test(candidate)) return candidate;
      } catch (e) {
        // not JSON
      }
    }
    // accept only JWT-like strings
    const jwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (jwtLike.test(t)) return t;
    try {
      localStorage.removeItem('campusconnect_access_token');
    } catch (e) {}
    return null;
  }
  if (typeof raw === 'object') return raw.access || raw.token || null;
  return null;
}

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campusconnect_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      localStorage.removeItem('campusconnect_user');
      return null;
    }
  });

  // Initialize token from localStorage, validating it
  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem('campusconnect_access_token');
      const extracted = _extractAccessToken(raw);

      // If extraction failed (invalid token was stored), clean it up
      if (!extracted && raw) {
        try {
          localStorage.removeItem('campusconnect_access_token');
          localStorage.removeItem('campusconnect_refresh_token');
          localStorage.removeItem('campusconnect_user');
        } catch (e) {}
      }

      return extracted;
    } catch (e) {
      try {
        localStorage.removeItem('campusconnect_access_token');
        localStorage.removeItem('campusconnect_refresh_token');
        localStorage.removeItem('campusconnect_user');
      } catch (e2) {}
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      // ensure API default header uses the plain token string
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        localStorage.setItem('campusconnect_access_token', token);
      } catch (e) {
        // ignore storage errors
      }
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('campusconnect_access_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusconnect_user');
    }
  }, [user]);

  // login accepts either a raw token string or an object { access: '...' }
  const login = ({ accessToken, refreshToken, userData }) => {
    let access = accessToken;
    if (typeof accessToken === 'object') access = accessToken?.access || accessToken?.token || null;
    if (typeof access === 'string') setToken(access);
    else setToken(null);
    // store refresh token separately if provided
    try {
      if (refreshToken && typeof refreshToken === 'string') {
        localStorage.setItem('campusconnect_refresh_token', refreshToken);
      } else {
        localStorage.removeItem('campusconnect_refresh_token');
      }
    } catch (e) {
      // ignore storage errors
    }
    setUser(userData);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('campusconnect_refresh_token');
    if (refreshToken) {
      try { await logoutUser(refreshToken); } catch (e) { /* Local cleanup is still required. */ }
    }
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('campusconnect_refresh_token');
    } catch (e) {}
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

