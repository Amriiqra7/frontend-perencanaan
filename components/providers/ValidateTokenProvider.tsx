'use client';

import { useEffect, useRef } from 'react';
import { useValidateToken } from '@/hooks/useValidateToken';
import { getBackendToken } from '@/lib/session';

interface ValidateTokenProviderProps {
  children: React.ReactNode;
}

export default function ValidateTokenProvider({ children }: ValidateTokenProviderProps): React.ReactElement {
  const token = getBackendToken();
  const { data, error, isLoading, mutate } = useValidateToken();
  const lastTokenRef = useRef<string | null>(null);
  const hasValidatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (token && token !== lastTokenRef.current && !hasValidatedRef.current) {
      lastTokenRef.current = token;
      hasValidatedRef.current = true;
      
      mutate().catch((err) => {
        console.error('[ValidateTokenProvider] Error during token validation:', err);
      });
    }
  }, [token, mutate]);

  useEffect(() => {
    if (error) {
      console.error('[ValidateTokenProvider] Token validation failed:', error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      if (data.success) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[ValidateTokenProvider] Token is valid:', data.user);
        }
      } else {
        console.warn('[ValidateTokenProvider] Token is invalid:', data.message);
      }
    }
  }, [data]);

  return <>{children}</>;
}
