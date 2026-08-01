import axios, { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { handleDemoRequest } from './demoEngine';

let accessTokenMemory: string | null = null;
let logoutCallback: (() => void) | null = null;

const isHostedPreview =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || !import.meta.env.VITE_API_URL);

const customAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  if (isHostedPreview) {
    let parsedData = config.data;
    if (typeof config.data === 'string') {
      try {
        parsedData = JSON.parse(config.data);
      } catch {
        parsedData = config.data;
      }
    }
    const demoRes = await handleDemoRequest(
      config.method || 'GET',
      config.url || '',
      parsedData
    );
    return {
      data: demoRes.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  const defaultAdapter = axios.getAdapter(axios.defaults.adapter);
  return defaultAdapter(config);
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  adapter: customAdapter,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setClientToken(token: string | null) {
  accessTokenMemory = token;
}

export function setLogoutHandler(cb: () => void) {
  logoutCallback = cb;
}

// Request Interceptor: Inject JWT token into Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessTokenMemory && config.headers) {
      config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent refresh on 401 Unauthorized
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Fallback to Demo Engine on connection error
    if (!error.response || error.code === 'ERR_NETWORK') {
      try {
        let parsedData = originalRequest?.data;
        if (typeof originalRequest?.data === 'string') {
          try {
            parsedData = JSON.parse(originalRequest.data);
          } catch {
            parsedData = originalRequest.data;
          }
        }
        const demoRes = await handleDemoRequest(
          originalRequest?.method || 'GET',
          originalRequest?.url || '',
          parsedData
        );
        return {
          data: demoRes.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest,
        };
      } catch (demoErr) {
        return Promise.reject(demoErr);
      }
    }

    // Check for authorization error
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        setClientToken(newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        if (logoutCallback) {
          logoutCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
