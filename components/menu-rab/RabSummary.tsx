'use client';

import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import type { RabSummary } from '@/types/rab';

interface RabSummaryProps {
  summary: RabSummary;
}

export default function RabSummary({ summary }: RabSummaryProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
        border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
            Jumlah
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {summary.jmlRab}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
            Total
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {summary.totalRab.toLocaleString('id-ID')}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
