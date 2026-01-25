'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { Box, IconButton, Popover, MenuList, MenuItem, ListItemIcon, ListItemText, Typography, Pagination } from '@mui/material';
import { Edit, Trash, TickCircle, CloseCircle, More, Eye } from 'iconsax-reactjs';
import type { RabData, RabSummary, RabPagination } from '@/types/rab';

interface RabTableProps {
  data: RabData[];
  summary: RabSummary;
  pagination?: RabPagination | null;
  onPageChange?: (page: number) => void;
  onDataChange?: (data: RabData[]) => void;
  onEdit?: (rowIndex: number) => void;
  onDelete?: (rowIndex: number) => void;
  onDetail?: (rowIndex: number) => void;
}

export default function RabTable({
  data,
  summary,
  pagination,
  onPageChange,
  onDataChange,
  onEdit,
  onDelete,
  onDetail,
}: RabTableProps): React.ReactElement {
  const [popoverAnchor, setPopoverAnchor] = useState<{ element: HTMLElement; rowIndex: number } | null>(null);

  const handleMoreClick = useCallback((event: React.MouseEvent<HTMLElement>, row: MRT_Row<RabData>): void => {
    event.stopPropagation();
    setPopoverAnchor({ element: event.currentTarget, rowIndex: row.index });
  }, []);

  const handlePopoverClose = useCallback((): void => {
    setPopoverAnchor(null);
  }, []);

  const handleEdit = useCallback((): void => {
    if (popoverAnchor && onEdit) {
      onEdit(popoverAnchor.rowIndex);
    }
    handlePopoverClose();
  }, [popoverAnchor, onEdit, handlePopoverClose]);

  const handleDelete = useCallback((): void => {
    if (popoverAnchor && onDelete) {
      onDelete(popoverAnchor.rowIndex);
    }
    handlePopoverClose();
  }, [popoverAnchor, onDelete, handlePopoverClose]);

  const handleDetailClick = useCallback((row: MRT_Row<RabData>): void => {
    if (onDetail) {
      onDetail(row.index);
    }
  }, [onDetail]);

  const columns = useMemo<MRT_ColumnDef<RabData>[]>(
    () => [
      {
        accessorKey: 'action',
        header: 'ACTION',
        size: 120,
        minSize: 120,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <IconButton
              size="small"
              onClick={(e) => handleMoreClick(e, row)}
              sx={{
                '&:hover': {
                  backgroundColor: '#FFF8E1',
                },
              }}
            >
              <More size={20} color="#666" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDetailClick(row)}
              sx={{
                '&:hover': {
                  backgroundColor: '#FFF8E1',
                },
              }}
            >
              <Eye size={18} color="#666" />
            </IconButton>
          </Box>
        ),
      },
      {
        accessorKey: 'setuju',
        header: 'Setuju',
        size: 100,
        minSize: 100,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const value = row.original.setuju;
          const isTrue = value === true;
          const IconComponent = isTrue ? TickCircle : CloseCircle;
          const iconColor = isTrue ? '#4CAF50' : '#f44336';

          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconComponent size={20} color={iconColor} />
            </Box>
          );
        },
      },
      {
        accessorKey: 'lunas',
        header: 'Lunas',
        size: 100,
        minSize: 100,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const value = row.original.lunas;
          const isTrue = value === true;
          const IconComponent = isTrue ? TickCircle : CloseCircle;
          const iconColor = isTrue ? '#4CAF50' : '#f44336';

          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconComponent size={20} color={iconColor} />
            </Box>
          );
        },
      },
      {
        accessorKey: 'noRab',
        header: 'NO RAB',
        size: 120,
        minSize: 120,
      },
      {
        accessorKey: 'tglRab',
        header: 'TGL RAB',
        size: 120,
        minSize: 120,
      },
      {
        accessorKey: 'jenisRab',
        header: 'Jenis RAB',
        size: 150,
        minSize: 150,
      },
      {
        accessorKey: 'nopel',
        header: 'Nopel',
        size: 120,
        minSize: 120,
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 200,
        minSize: 200,
      },
      {
        accessorKey: 'alamat',
        header: 'Alamat',
        size: 300,
        minSize: 300,
      },
    ],
    [handleMoreClick, handleDetailClick]
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
    enableBottomToolbar: false,
    enableTopToolbar: false,
    muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: 'none',
        border: '1px solid #FFE0B2',
        margin: 0,
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#FFF8E1',
        fontWeight: 600,
        fontSize: '0.875rem',
        whiteSpace: 'nowrap',
        overflow: 'visible',
        textOverflow: 'clip',
        padding: '16px',
        '& .MuiTableSortLabel-root': {
          whiteSpace: 'nowrap',
          overflow: 'visible',
          textOverflow: 'clip',
          width: '100%',
          '& .MuiTableSortLabel-icon': {
            marginLeft: '4px',
          },
        },
        '& .MuiBox-root': {
          whiteSpace: 'nowrap',
          overflow: 'visible',
          textOverflow: 'clip',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
      },
    },
    renderBottomToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: '#FFF8E1',
          borderTop: '1px solid #FFE0B2',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Jumlah
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {summary.jmlRab}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              {summary.totalRab.toLocaleString('id-ID')}
            </Typography>
          </Box>
        </Box>
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid #FFE0B2',
            }}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={(event, value) => onPageChange(value)}
              color="primary"
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
                    backgroundColor: '#FFF3E0',
                  },
                },
              }}
            />
          </Box>
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
