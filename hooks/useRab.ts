'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRab } from '@/core/services/api';
import type { RabData, RabFilter, RabPagination } from '@/types/rab';

interface UseRabReturn {
  data: RabData[];
  isLoading: boolean;
  pagination: RabPagination | null;
  refetch: () => Promise<void>;
}

interface UseRabParams {
  q?: string;
  tanggalRab?: string;
  page?: number;
  limit?: number;
}

const mapRabData = (apiData: RabData[]): RabData[] => {
  return apiData.map((item) => ({
    ...item,
    noRab: item.detail_rab?.no_rab,
    tglRab: item.detail_rab?.tanggal_rab,
    jenisRab: item.detail_rab?.jenis_rab,
    nopel: item.detail_rab?.no_pelanggan,
    nama: item.detail_rab?.nama_pelanggan,
    alamat: item.detail_rab?.alamat,
    wilayah: item.detail_rab?.wilayah,
    setuju: false,
    lunas: false,
  }));
};

export function useRab(filter?: RabFilter, page: number = 1, limit: number = 10): UseRabReturn {
  const [data, setData] = useState<RabData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<RabPagination | null>(null);

  const fetchRab = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const params: Record<string, unknown> = {
        page,
        limit,
      };
      
      if (filter?.noRab) {
        params.q = filter.noRab;
      }
      
      if (filter?.tglRab) {
        params.tanggalRab = filter.tglRab;
      }

      const response = await getRab.getAll(params);

      if (response && response.success && response.dataL && Array.isArray(response.dataL)) {
        const mappedData = mapRabData(response.dataL);
        setData(mappedData);
        setPagination(response.pagination || null);
      } else {
        throw new Error('Format data RAB tidak valid');
      }
    } catch (err) {
      console.error('Error fetching RAB:', err);
      setData([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, limit]);

  useEffect(() => {
    fetchRab();
  }, [fetchRab]);

  return {
    data,
    isLoading,
    pagination,
    refetch: fetchRab,
  };
}
