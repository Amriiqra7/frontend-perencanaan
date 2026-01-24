import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { INTERCEPTOR_CONFIG, setupInterceptorsTo } from "./interceptors";
import type { AxiosInstanceOptions, AxiosInstanceConfig } from '@/types/core';

export const createAxiosInstance = (
  options: AxiosInstanceOptions = {},
  axiosConfig: AxiosInstanceConfig = {}
): AxiosInstance => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASEURL}`;

  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: INTERCEPTOR_CONFIG.REQUEST_TIMEOUT || 1 * 60 * 1000,
    ...axiosConfig,
  });

  setupInterceptorsTo(instance, {
    disableErrorToast: false,
    ...options,
  });

  return instance;
};
