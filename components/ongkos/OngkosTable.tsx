'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { Box, IconButton, Popover, MenuList, MenuItem, ListItemIcon, ListItemText, Typography, Pagination, useTheme } from '@mui/material';
import { Edit, Trash, More, Eye } from 'iconsax-reactjs';
import type { OngkosData, OngkosPagination } from '@/types/ongkos';

interface OngkosTableProps {
  data: OngkosData[];
  pagination?: OngkosPagination | null;
  onPageChange?: (page: number) => void;
  onEdit?: (row: OngkosData) => void;
  onDelete?: (row: OngkosData) => void;
  onDetail?: (row: OngkosData) => void;
}

export default function OngkosTable({
  data,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onDetail,
}: OngkosTableProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [popoverAnchor, setPopoverAnchor] = useState<{ element: HTMLElement; row: OngkosData } | null>(null);

  const handleMoreClick = useCallback((event: React.MouseEvent<HTMLElement>, row: MRT_Row<OngkosData>): void => {
    event.stopPropagation();
    setPopoverAnchor({ element: event.currentTarget, row: row.original });
  }, []);

  const handlePopoverClose = useCallback((): void => {
    setPopoverAnchor(null);
  }, []);

  const handleEdit = useCallback((): void => {
    if (popoverAnchor && onEdit) {
      onEdit(popoverAnchor.row);
    }
    handlePopoverClose();
  }, [popoverAnchor, onEdit, handlePopoverClose]);

  const handleDelete = useCallback((): void => {
    if (popoverAnchor && onDelete) {
      onDelete(popoverAnchor.row);
    }
    handlePopoverClose();
  }, [popoverAnchor, onDelete, handlePopoverClose]);

  const handleDetailClick = useCallback((row: MRT_Row<OngkosData>): void => {
    if (onDetail) {
      onDetail(row.original);
    }
  }, [onDetail]);

  const columns = useMemo<MRT_ColumnDef<OngkosData>[]>(
    () => [
      {
        accessorKey: 'action',
        header: 'ACTION',
        size: 100,
        minSize: 100,
        maxSize: 100,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', width: '100%' }}>
            <IconButton
              size="small"
              onClick={(e) => handleMoreClick(e, row)}
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#FFF8E1',
                },
              }}
            >
              <More size={18} color={isDarkMode ? '#b0b0b0' : '#666'} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDetailClick(row)}
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#FFF8E1',
                },
              }}
            >
              <Eye size={18} color={isDarkMode ? '#b0b0b0' : '#666'} />
            </IconButton>
          </Box>
        ),
      },
      {
        accessorKey: 'kode_ongkos',
        header: 'KODE',
        size: 120,
        minSize: 120,
      },
      {
        accessorKey: 'nama_ongkos',
        header: 'NAMA',
        size: 250,
        minSize: 200,
      },
      {
        accessorKey: 'satuan_ongkos.kode',
        header: 'SATUAN',
        size: 120,
        minSize: 120,
        Cell: ({ row }) => row.original.satuan_ongkos?.kode || '-',
      },
      {
        accessorKey: 'harga_ongkos',
        header: 'HARGA',
        size: 150,
        minSize: 150,
        Cell: ({ row }) => {
          const harga = parseFloat(row.original.harga_ongkos || '0');
          return `Rp ${harga.toLocaleString('id-ID')}`;
        },
      },
      {
        accessorKey: 'created_at',
        header: 'TANGGAL BUAT',
        size: 180,
        minSize: 180,
        Cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        },
      },
    ],
    [handleMoreClick, handleDetailClick, isDarkMode, theme]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: false,
    enableColumnOrdering: false,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enablePagination: false,
    enableBottomToolbar: true,
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: 'none',
        border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
        margin: 0,
        backgroundColor: theme.palette.background.paper,
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
        fontWeight: 600,
        fontSize: '0.875rem',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        textOverflow: 'clip',
        color: theme.palette.text.primary,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
    renderBottomToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2,
        }}
      >
        {pagination && onPageChange && (
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#FF8C00',
                '&.Mui-selected': {
                  backgroundColor: '#FF8C00',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#FF7F00',
                  },
                },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.2)' : '#FFF3E0',
                },
              },
            }}
          />
        )}
      </Box>
    ),
  });

  return (
    <Box sx={{ width: '100%' }}>
      <MaterialReactTable table={table} />

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor?.element || null}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuList>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit size={18} color="#FF8C00" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Trash size={18} color="#f44336" />
            </ListItemIcon>
            <ListItemText>Hapus</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
}
