'use client';

import React from 'react';
import { Box, Paper, Typography, Button, useTheme } from '@mui/material';

interface CustomerDetail {
  noReg: string;
  nopel: string;
  nama: string;
  alamat: string;
  wilayah: string;
  rayon: string;
}

interface DetailPelangganProps {
  customerDetail: CustomerDetail;
  onGantiClick?: () => void;
}

export default function DetailPelanggan({
  customerDetail,
  onGantiClick,
}: DetailPelangganProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box 
      sx={{ 
        width: { xs: '100%', sm: '100%', md: '20%' }, 
        p: { xs: 0, md: 1 },
        display: 'flex', 
        minWidth: 0, 
        alignSelf: 'stretch',
      }}
    >
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 2 },
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', md: '100%' },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            borderBottom: '2px solid #FF8C00',
            pb: 1,
          }}
        >
          Detail Pelanggan
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              NO REG
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              {customerDetail.noReg}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                NOPEL
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                {customerDetail.nopel}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              NAMA
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              {customerDetail.nama}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              ALAMAT
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              {customerDetail.alamat}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              WILAYAH
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              {customerDetail.wilayah}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              RAYON
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              {customerDetail.rayon}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
