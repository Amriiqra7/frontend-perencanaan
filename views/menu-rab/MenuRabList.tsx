'use client';

import React, { useState, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import RabHeader from '@/components/menu-rab/RabHeader';
import RabTable from '@/components/menu-rab/RabTable';
import FilterDrawer from '@/components/menu-rab/FilterDrawer';
import RabDetailDialog from '@/components/menu-rab/RabDetailDialog';
import { getRab } from '@/core/services/api';
import type { RabData, RabFilter, RabSummary as RabSummaryType, RabResponse } from '@/types/rab';

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState<RabFilter>({});
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [selectedRabId, setSelectedRabId] = useState<number | null>(null);

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page,
      limit,
    };
    
    if (filter?.tglRab) {
      params.tanggalRab = filter.tglRab;
    }
    
    if (filter?.lunas !== undefined) {
      params.isLunas = filter.lunas ? 1 : 0;
    }
    
    if (filter?.setuju !== undefined) {
      params.isSetuju = filter.setuju ? 1 : 0;
    }
    
    if (filter?.noRab) {
      params.noRab = filter.noRab;
    }
    
    if (filter?.jenisRab) {
      params.jenisRab = filter.jenisRab;
    }
    
    if (filter?.noPel) {
      params.noPelanggan = filter.noPel;
    }
    
    if (filter?.nama) {
      params.namaPelanggan = filter.nama;
    }
    
    if (filter?.wilayah_id) {
      params.wilayahId = filter.wilayah_id;
    }
    
    if (filter?.rayon_id) {
      params.rayonId = filter.rayon_id;
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

  const filteredData = data;

  const summary: RabSummaryType = useMemo(() => {
    const totalRab = filteredData.reduce((sum, item) => {
      return sum + (item.detail_rab?.total_rab || 0);
    }, 0);
    
    return {
      jmlRab: pagination?.totalRecords || filteredData.length,
      totalRab: totalRab,
    };
  }, [filteredData, pagination]);

  const handleFilterChange = (newFilter: RabFilter): void => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleResetFilter = (): void => {
    setFilter({});
  };

  const handleDetail = (rowIndex: number): void => {
    const selectedData = filteredData[rowIndex];
    if (selectedData && selectedData.id) {
      setSelectedRabId(selectedData.id);
      setDetailDialogOpen(true);
    }
  };

  const handleCloseDetailDialog = (): void => {
    setDetailDialogOpen(false);
    setSelectedRabId(null);
  };

  const {
    data: rabDetailResponse,
    isLoading: isLoadingDetail,
  } = useSWR(
    detailDialogOpen && selectedRabId ? ['rab-detail', selectedRabId] : null,
    () => getRab.getById(selectedRabId!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

    return (
    <Box sx={{ width: '100%', p: 1 }}>
      <RabHeader
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
            onEdit={(rowIndex) => {
              const selectedData = filteredData[rowIndex];
              if (selectedData && selectedData.id) {
                window.location.href = `/menu-rab/edit/${selectedData.id}`;
              }
            }}
            onDelete={(rowIndex) => {
              console.log('Delete row:', rowIndex);
            }}
            onDetail={handleDetail}
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

      <RabDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        rabData={rabDetailResponse?.success ? rabDetailResponse.data : null}
      />
    </Box>
  );
}
