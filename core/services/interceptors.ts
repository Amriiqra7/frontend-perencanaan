import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { InterceptorConfig, InterceptorOptions, HandleRequestFunction } from '@/types/core';
import { getBackendToken, removeBackendToken } from '@/lib/session';
import toast from 'react-hot-toast';

const INTERCEPTOR_CONFIG: InterceptorConfig = {
  TOAST_COOLDOWN: 2000,
  MAX_RETRY_ATTEMPTS: 0,
  RETRY_DELAY_BASE: 1000,
  REQUEST_TIMEOUT: 1 * 60 * 1000,
  AUTH_REDIRECT_DELAY: 1500,
  DEBUG_MODE: false,
  ENABLE_RETRY: false,
};

export const createHandleRequest = (): HandleRequestFunction => {
  return <T = unknown>(request: Promise<AxiosResponse<T>>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      request
        .then((res: AxiosResponse<T>) => resolve(res.data))
        .catch((err: AxiosError) => reject(err));
    });
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance,
  options: InterceptorOptions = {}
): void {
  const config: InterceptorOptions = {
    disableErrorToast: false,
    disableSuccessToast: false,
    disableAuth: false,
    disableRetry: false,
    enablePerformanceMonitoring: false,
    ...options,
  };

  axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      if (config.disableAuth || typeof window === 'undefined') {
        return requestConfig;
      }

      const token = getBackendToken();
      if (token && requestConfig.headers) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Axios Interceptor] Token added to request:', {
            url: requestConfig.url,
            method: requestConfig.method,
            hasToken: !!token,
            tokenLength: token.length,
            hasAuthHeader: !!requestConfig.headers.Authorization,
          });
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Axios Interceptor] No token found for request:', {
            url: requestConfig.url,
            method: requestConfig.method,
            disableAuth: config.disableAuth,
            windowAvailable: typeof window !== 'undefined',
          });
        }
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        removeBackendToken();
      }

      if (!config.disableErrorToast && typeof window !== 'undefined') {
        let errorMessage = 'Terjadi kesalahan pada server';
        
        if (error.response?.data) {
          const data = error.response.data as Record<string, unknown>;
          errorMessage = 
            (data.message as string) || 
            (data.error as string) || 
            (typeof data === 'string' ? data : errorMessage);
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        try {
          toast.error(errorMessage);
          if (process.env.NODE_ENV === 'development') {
            console.log('[Interceptor] Toast shown:', errorMessage);
          }
        } catch (err) {
          console.error('[Interceptor] Error showing toast:', err);
        }
      }

      return Promise.reject(error);
    }
  );
}

export {
  INTERCEPTOR_CONFIG,
};