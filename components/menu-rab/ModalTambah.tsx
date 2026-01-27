'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import { SearchNormal1 } from 'iconsax-reactjs';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import * as API from '@/core/services/api';
import TablePagination from '@/components/common/TablePagination';
import type { RabType, PasangBaruData, PelayananLainData, RabPagination } from '@/types/rab';

interface SelectRabDialogProps {
  open: boolean;
  onClose: () => void;
  rabType: RabType;
}

type TableData = PasangBaruData | PelayananLainData;

export default function SelectRabDialog({
  open,
  onClose,
  rabType,
}: SelectRabDialogProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [pagePasangBaru, setPagePasangBaru] = useState<number>(1);
  const [pagePelayananLain, setPagePelayananLain] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const columnOrder = useMemo(() => {
    if (activeTab === 0) {
      return ['no', 'no_regis', 'jenis', 'nama', 'alamat', 'action'];
    } else {
      return ['no', 'no_regis', 'jenis', 'no_pelanggan', 'nama', 'alamat', 'action'];
    }
  }, [activeTab]);

  const {
    data: pasangBaruResponse,
    isLoading: isLoadingPasangBaru,
  } = useSWR(
    open && activeTab === 0 ? ['pasang-baru', rabType, pagePasangBaru, limit] : null,
    () => API.getRab.getPasangBaru({ page: pagePasangBaru, limit }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const {
    data: pelayananLainResponse,
    isLoading: isLoadingPelayananLain,
  } = useSWR(
    open && activeTab === 1 ? ['pelayanan-lain', rabType, pagePelayananLain, limit] : null,
    () => API.getRab.getPelayananLain({ page: pagePelayananLain, limit }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const pasangBaruData: PasangBaruData[] = useMemo(() => {
    if (pasangBaruResponse && pasangBaruResponse.success && pasangBaruResponse.data) {
      return pasangBaruResponse.data;
    }
    return [];
  }, [pasangBaruResponse]);

  const pelayananLainData: PelayananLainData[] = useMemo(() => {
    if (pelayananLainResponse && pelayananLainResponse.success && pelayananLainResponse.data) {
      return pelayananLainResponse.data;
    }
    return [];
  }, [pelayananLainResponse]);

  const filteredPasangBaruData: PasangBaruData[] = useMemo(() => {
    if (!searchQuery.trim()) {
      return pasangBaruData;
    }
    const query = searchQuery.toLowerCase().trim();
    return pasangBaruData.filter((item) => {
      return (
        (item.no_regis?.toLowerCase().includes(query)) ||
        (item.nama?.toLowerCase().includes(query)) ||
        (item.alamat?.toLowerCase().includes(query)) ||
        (item.jenis?.toLowerCase().includes(query))
      );
    });
  }, [pasangBaruData, searchQuery]);

  const filteredPelayananLainData: PelayananLainData[] = useMemo(() => {
    if (!searchQuery.trim()) {
      return pelayananLainData;
    }
    const query = searchQuery.toLowerCase().trim();
    return pelayananLainData.filter((item) => {
      return (
        (item.no_regis?.toLowerCase().includes(query)) ||
        (item.nama?.toLowerCase().includes(query)) ||
        (item.alamat?.toLowerCase().includes(query)) ||
        (item.jenis?.toLowerCase().includes(query)) ||
        (item.no_pelanggan?.toLowerCase().includes(query))
      );
    });
  }, [pelayananLainData, searchQuery]);

  const currentData: TableData[] = activeTab === 0 ? filteredPasangBaruData : filteredPelayananLainData;
  const isLoading = activeTab === 0 ? isLoadingPasangBaru : isLoadingPelayananLain;

  const currentPagination: RabPagination | null = useMemo(() => {
    if (activeTab === 0) {
      return pasangBaruResponse?.pagination || null;
    } else {
      return pelayananLainResponse?.pagination || null;
    }
  }, [activeTab, pasangBaruResponse, pelayananLainResponse]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
    setSearchQuery('');
    if (newValue === 0) {
      setPagePasangBaru(1);
    } else {
      setPagePelayananLain(1);
    }
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
    if (activeTab === 0) {
      setPagePasangBaru(1);
    } else {
      setPagePelayananLain(1);
    }
  }, [activeTab]);

  const handleClose = useCallback((): void => {
    setSearchQuery('');
    setPagePasangBaru(1);
    setPagePelayananLain(1);
    onClose();
  }, [onClose]);

  const handlePageChange = useCallback((newPage: number): void => {
    if (activeTab === 0) {
      setPagePasangBaru(newPage);
    } else {
      setPagePelayananLain(newPage);
    }
  }, [activeTab]);

  const handleProses = useCallback((row: MRT_Row<TableData>): void => {
    const isPasangBaru = activeTab === 0;
    const rowData = row.original;
    
    let pelangganId: string | null = null;
    
    if (!isPasangBaru) {
      if ('pelanggan_id' in rowData && rowData.pelanggan_id) {
        pelangganId = rowData.pelanggan_id.toString();
      }
    } else {
      pelangganId = rowData.id.toString();
    }
    
    const params = new URLSearchParams();
    params.set('type', isPasangBaru ? 'pasang-baru' : 'pelayanan-lain');
    if (pelangganId) {
      params.set('pelangganId', pelangganId);
    }
    
    router.push(`/menu-rab/new?${params.toString()}`);
  }, [router, activeTab]);

  const columns = useMemo<MRT_ColumnDef<TableData>[]>(
    () => {
      const currentPage = activeTab === 0 ? pagePasangBaru : pagePelayananLain;
      
      const baseColumns: MRT_ColumnDef<TableData>[] = [
        {
          id: 'no',
          accessorKey: 'no',
          header: 'NO',
          size: 80,
          minSize: 80,
          enableColumnFilter: false,
          enableSorting: false,
          Cell: ({ row }) => {
            return ((currentPage - 1) * limit) + row.index + 1;
          },
        },
        {
          id: 'no_regis',
          accessorKey: 'no_regis',
          header: 'NO REG',
        },
        {
          id: 'jenis',
          accessorKey: 'jenis',
          header: 'Jenis',
          Cell: ({ row }) => {
            return (row.original.jenis || '-');
          },
        },
      ];

      if (activeTab === 1) {
        baseColumns.push({
          id: 'no_pelanggan',
          accessorKey: 'no_pelanggan',
          header: 'NO PEL',
          Cell: ({ row }) => {
            return (row.original as PelayananLainData).no_pelanggan || '-';
          },
        });
      }

      baseColumns.push(
        {
          id: 'nama',
          accessorKey: 'nama',
          header: 'Nama',
          Cell: ({ row }) => {
            return row.original.nama || '-';
          },
        },
        {
          id: 'alamat',
          accessorKey: 'alamat',
          header: 'Alamat',
          Cell: ({ row }) => {
            return row.original.alamat || '-';
          },
        }
      );

      baseColumns.push({
        id: 'action',
        accessorKey: 'action',
        header: 'Action',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleProses(row)}
            sx={{
              textTransform: 'none',
              backgroundColor: '#FF8C00',
              '&:hover': {
                backgroundColor: '#FF7F00',
              },
            }}
          >
            Proses
          </Button>
        ),
      });

      return baseColumns;
    },
    [handleProses, activeTab, limit, pagePasangBaru, pagePelayananLain]
  );

  const table = useMaterialReactTable({
    columns,
    data: currentData,
    initialState: {
      columnOrder,
    },
    state: {
      isLoading,
      columnOrder,
    },
    enableColumnResizing: false,
    enableColumnOrdering: false,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    muiTableContainerProps: { sx: { maxHeight: '400px' } },
    muiTablePaperProps: { sx: { boxShadow: 'none' } },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
        fontWeight: 600,
        fontSize: '0.875rem',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        textOverflow: 'clip',
        padding: '16px',
        color: theme.palette.text.primary,
      },
    },
    muiTableBodyCellProps: { 
      sx: { 
        fontSize: '0.875rem',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      } 
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '500px',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              SILAHKAN PILIH NO REGISTRASI DI BAWAH INI
            </Box>
          </Box>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Pasang Baru" />
            <Tab label="Pelayanan Lain" />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Cari berdasarkan No Regis, Nama, Alamat, Jenis..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          </Box>
          <MaterialReactTable table={table} />
          {!searchQuery.trim() && (
            <TablePagination
              pagination={currentPagination}
              onPageChange={handlePageChange}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
