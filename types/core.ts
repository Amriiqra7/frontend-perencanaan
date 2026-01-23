import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface InterceptorConfig {
  TOAST_COOLDOWN: number;
  MAX_RETRY_ATTEMPTS: number;
  RETRY_DELAY_BASE: number;
  REQUEST_TIMEOUT: number;
  AUTH_REDIRECT_DELAY: number;
  DEBUG_MODE: boolean;
  ENABLE_RETRY: boolean;
}

export interface InterceptorOptions {
  disableErrorToast?: boolean;
  disableSuccessToast?: boolean;
  disableAuth?: boolean;
  disableRetry?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export interface AxiosInstanceOptions extends InterceptorOptions {
  [key: string]: unknown;
}

export interface AxiosInstanceConfig extends AxiosRequestConfig {
  [key: string]: unknown;
}

export type HandleRequestFunction = <T = unknown>(
  request: Promise<AxiosResponse<T>>
) => Promise<T>;

export type CreateAxiosInstanceFunction = (
  options?: AxiosInstanceOptions,
  axiosConfig?: AxiosInstanceConfig
) => AxiosInstance;

export type SetupInterceptorsFunction = (
  axiosInstance: AxiosInstance,
  options?: InterceptorOptions
) => void;
