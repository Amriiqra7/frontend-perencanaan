'use client';

import useSWR from 'swr';
import * as API from '@/core/services/api';
import { getBackendToken } from '@/lib/session';

interface ValidateTokenResponse {
  success: boolean;
  user?: unknown;
  message?: string;
}

interface UseValidateTokenReturn {
  data: ValidateTokenResponse | undefined;
  isLoading: boolean;
  error: Error | undefined;
  isValid: boolean;
  mutate: () => Promise<ValidateTokenResponse | undefined>;
}

export function useValidateToken(): UseValidateTokenReturn {
  const token = getBackendToken();
  const shouldFetch = !!token;

  const { data, error, isLoading, mutate } = useSWR<ValidateTokenResponse>(
    shouldFetch ? 'validate-token' : null,
    () => API.validateToken(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
      dedupingInterval: 0,
      errorRetryCount: 0,
      errorRetryInterval: 0,
      shouldRetryOnError: false,
      keepPreviousData: false,
    }
  );

  return {
    data,
    isLoading,
    error: error as Error | undefined,
    isValid: data?.success === true,
    mutate,
  };
}
