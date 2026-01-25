'use client';

import React, { useState, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import RabHeader from '@/components/menu-rab/RabHeader';
import RabTable from '@/components/menu-rab/RabTable';
import FilterDrawer from '@/components/menu-rab/FilterDrawer';
import { getRab } from '@/core/services/api';
import type { RabData, RabFilter, RabSummary as RabSummaryType, RabType, RabResponse } from '@/types/rab';

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

export default function MenuRabList(): React.ReactElement {
  const [rabType, setRabType] = useState<RabType>('pelanggan');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState<RabFilter>({});
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const queryParams = useMemo(() => {
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
    
    return params;
  }, [filter, page, limit]);

  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR<RabResponse>(
    ['rab', queryParams],
    () => getRab.getAll(queryParams),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (error) => {
        console.error('[MenuRabList] Failed to load RAB data!', error);
      },
      onSuccess: (data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[MenuRabList] RAB data loaded successfully:', data);
        }
      },
    }
  );

  const data = useMemo(() => {
    if (response && response.success && response.dataL && Array.isArray(response.dataL)) {
      return mapRabData(response.dataL);
    }
    return [];
  }, [response]);

  const pagination = useMemo(() => {
    return response?.pagination || null;
  }, [response]);

  const isLoading = isValidating;

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.filter((item) => {
      if (filter.jenisRab && !item.jenisRab?.toLowerCase().includes(filter.jenisRab.toLowerCase())) {
        return false;
      }
      if (filter.noPel && !item.nopel?.toLowerCase().includes(filter.noPel.toLowerCase())) {
        return false;
      }
      if (filter.nama && !item.nama?.toLowerCase().includes(filter.nama.toLowerCase())) {
        return false;
      }
      if (filter.wilayah && !item.wilayah?.toLowerCase().includes(filter.wilayah.toLowerCase())) {
        return false;
      }
      if (filter.rayon && !item.rayon?.toLowerCase().includes(filter.rayon.toLowerCase())) {
        return false;
      }
      if (filter.setuju !== undefined && item.setuju !== filter.setuju) {
        return false;
      }
      if (filter.lunas !== undefined && item.lunas !== filter.lunas) {
        return false;
      }
      return true;
    });
  }, [data, filter]);

  const summary: RabSummaryType = useMemo(() => {
    const totalRab = filteredData.reduce((sum, item) => {
      return sum + (item.detail_rab?.total_rab || 0);
    }, 0);
    
    return {
      jmlRab: pagination?.totalRecords || filteredData.length,
      totalRab: totalRab,
    };
  }, [filteredData, pagination]);

  const handleDataChange = async (): Promise<void> => {
    await mutate();
  };

  const handleFilterChange = (newFilter: RabFilter): void => {
    setFilter(newFilter);
  };

  const handleResetFilter = (): void => {
    setFilter({});
  };

    return (
    <Box sx={{ width: '100%', p: 1 }}>
      <RabHeader
        rabType={rabType}
        onRabTypeChange={setRabType}
        onFilterToggle={() => setFilterDrawerOpen(!filterDrawerOpen)}
        filterOpen={filterDrawerOpen}
        onExport={() => {
          console.log('Export clicked');
        }}
      />

      <Box sx={{ display: 'flex', gap: 0, position: 'relative', width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0, width: '100%', overflow: 'hidden', position: 'relative' }}>
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1000,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <RabTable
            data={filteredData}
            summary={summary}
            pagination={pagination}
            onPageChange={setPage}
            onDataChange={handleDataChange}
            onEdit={(rowIndex) => {
              console.log('Edit row:', rowIndex);
            }}
            onDelete={(rowIndex) => {
              console.log('Delete row:', rowIndex);
            }}
            onDetail={(rowIndex) => {
              console.log('Detail row:', rowIndex);
            }}
          />
        </Box>

        <FilterDrawer
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          filter={filter}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
        />
      </Box>
    </Box>
  );
}
