import { useEffect, useState, useCallback } from 'react';
import { getMenu } from '@/core/services/api';
import { getSidebar, setSidebar } from '@/lib/sidebar';
import { getBackendToken } from '@/lib/session';
import type { MenuGroup } from '@/types/settings';

interface UseMenuReturn {
  menuData: MenuGroup[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMenu(): UseMenuReturn {
  const [menuData, setMenuData] = useState<MenuGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedMenu = getSidebar();
      if (cachedMenu) {
        setMenuData(cachedMenu);
        setIsLoading(false);
        return;
      }

      const token = getBackendToken();
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login ulang.');
      }

      const response = await getMenu.getAll();

      if (response && response.data && Array.isArray(response.data)) {
        setSidebar(response.data);
        setMenuData(response.data);
      } else {
        throw new Error('Format data menu tidak valid');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat menu';
      setError(errorMessage);
      console.error('Error fetching menu:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    menuData,
    isLoading,
    error,
    refetch: fetchMenu,
  };
}
