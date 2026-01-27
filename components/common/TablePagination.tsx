'use client';

import React from 'react';
import { Box, Pagination, useTheme } from '@mui/material';
import type { RabPagination } from '@/types/rab';

interface TablePaginationProps {
  pagination: RabPagination | null | undefined;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  pagination,
  onPageChange,
}: TablePaginationProps): React.ReactElement | null {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
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
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
      }}
    >
      <Pagination
        count={pagination.totalPages}
        page={pagination.currentPage}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.palette.text.primary,
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
    </Box>
  );
}
