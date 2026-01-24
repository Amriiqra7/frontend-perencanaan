'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { RabSummary } from '@/types/rab';

interface RabSummaryProps {
  summary: RabSummary;
}

export default function RabSummary({ summary }: RabSummaryProps): React.ReactElement {
  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: '#FFF8E1',
        border: '1px solid #FFE0B2',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
    </Paper>
  );
}
