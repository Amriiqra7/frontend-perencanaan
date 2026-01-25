'use client';

import React from 'react';
import { Box, Pagination } from '@mui/material';
import type { RabPagination } from '@/types/rab';

interface TablePaginationProps {
  pagination: RabPagination | null | undefined;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  pagination,
  onPageChange,
}: TablePaginationProps): React.ReactElement | null {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
        p: 2,
        borderTop: '1px solid #FFE0B2',
        backgroundColor: '#FFF8E1',
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
  );
}
