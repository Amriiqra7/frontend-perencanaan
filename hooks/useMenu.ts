'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { getSidebar, setSidebar } from '@/lib/sidebar';
import { getBackendToken } from '@/lib/session';
import type { MenuGroup } from '@/types/settings';
import * as API from '@/core/services/api';

interface UseMenuReturn {
  menuData: MenuGroup[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMenu(): UseMenuReturn {
  const token = getBackendToken();
  const shouldFetch = !!token;

  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR(
    shouldFetch ? 'menu' : null,
    () => API.getMenu.getAll(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setSidebar(data.data);
          }
        },
      }
  );

  const menuData = useMemo(() => {
    if (response && response.data && Array.isArray(response.data)) {
      return response.data; 
    }
    return getSidebar();
  }, [response]);

  const errorMessage = useMemo(() => {
    if (error) {
      return error instanceof Error ? error.message : 'Gagal memuat menu';
    }
    return null;
  }, [error]);

  return {
    menuData,
    isLoading: isValidating,
    error: errorMessage,
    refetch: async () => {
      await mutate();
    },
  };
}
