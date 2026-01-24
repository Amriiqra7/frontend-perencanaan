'use client';

import React, { useState, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import RabHeader from '@/components/menu-rab/RabHeader';
import RabTable from '@/components/menu-rab/RabTable';
import FilterDrawer from '@/components/menu-rab/FilterDrawer';
import { useRab } from '@/hooks/useRab';
import type { RabFilter, RabSummary as RabSummaryType, RabType } from '@/types/rab';

export default function MenuRabList(): React.ReactElement {
  const [rabType, setRabType] = useState<RabType>('pelanggan');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState<RabFilter>({});
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const { data, isLoading, pagination, refetch } = useRab(filter, page, limit);

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

  const handleDataChange = (): void => {
    refetch();
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
