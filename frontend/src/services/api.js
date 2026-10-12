import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to extract a plain access token string from possible legacy storage formats.
function extractAccessToken(raw) {
  if (!raw) return null;
  // If it's already a simple string token, return it
  if (typeof raw === 'string') {
    // If the string looks like a JSON object, try to parse it and extract .access
    const trimmed = raw.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || trimmed.startsWith('"{')) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed.access || parsed.token || null;
        }
      } catch (e) {
        // not JSON, fallthrough
      }
    }
    // If it looks like a JWT (three parts separated by dots), accept it.
    const jwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (jwtLike.test(trimmed)) return trimmed;
    // Catch obvious invalid stored values like '[object Object]' and remove them
    try {
      localStorage.removeItem('campusconnect_access_token');
    } catch (e) {}
    return null;
  }
  // If it's an object (some code accidentally stored an object), extract known fields
  if (typeof raw === 'object') {
    const candidate = raw.access || raw.token || null;
    const jwtLike = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (typeof candidate === 'string' && jwtLike.test(candidate)) return candidate;
    try {
      localStorage.removeItem('campusconnect_access_token');
    } catch (e) {}
    return null;
  }
  return null;
}

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('campusconnect_access_token');
  const token = extractAccessToken(raw);

  // Do not attach Authorization header for auth endpoints (register/login/roles) to avoid token validation on public endpoints
  const noAuthPaths = ['/api/auth/register/', '/api/auth/login/', '/api/auth/roles/'];
  const url = config.url || '';

  // Build the full URL to check
  const fullUrl = config.baseURL
    ? (config.baseURL.endsWith('/') ? config.baseURL.slice(0, -1) : config.baseURL) +
      (url.startsWith('/') ? url : '/' + url)
    : url;

  const isAuthPath = noAuthPaths.some((p) =>
    url.includes(p) || fullUrl.includes(p)
  );

  if (token && !isAuthPath) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    // Log token presence/type (do NOT log token value)
    try {
      console.debug('[api] attaching Authorization header to', fullUrl);
    } catch (e) {}
  } else {
    // ensure we don't accidentally send an invalid header
    if (config.headers && config.headers.Authorization) delete config.headers.Authorization;
    try {
      console.debug('[api] not attaching Authorization header to', fullUrl, 'isAuthPath=', isAuthPath, 'tokenPresent=', !!token);
    } catch (e) {}
  }

  return config;
}, (error) => Promise.reject(error));

// Remove stale tokens on token validation failures coming from the backend.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const data = error?.response?.data;

      // SIMPLE_JWT returns messages indicating token_not_valid; clear stored tokens when seen.
      const isTokenNotValid =
        status === 401 &&
        (data?.code === 'token_not_valid' || (data?.detail && (typeof data.detail === 'string' ? data.detail.includes('token_not_valid') : data.detail.code === 'token_not_valid')));

      if (isTokenNotValid) {
        try {
          localStorage.removeItem('campusconnect_access_token');
          localStorage.removeItem('campusconnect_user');
          localStorage.removeItem('campusconnect_refresh_token');
          delete api.defaults.headers.common.Authorization;
          console.debug('[api] cleared stored tokens due to token_not_valid from', error?.response?.config?.url);
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore unexpected shapes
    }

    return Promise.reject(error);
  }
);

export default api;
