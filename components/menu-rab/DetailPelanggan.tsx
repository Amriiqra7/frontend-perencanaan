'use client';

import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

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
  return (
    <Box sx={{ width: { xs: '100%', md: '20%' }, p: 1, display: 'flex', minWidth: 0, alignSelf: 'stretch' }}>
      <Paper
        sx={{
          p: 2,
          width: '100%',
          backgroundColor: '#fff',
          border: '1px solid #FFE0B2',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#333',
            borderBottom: '2px solid #FF8C00',
            pb: 1,
          }}
        >
          Detail Pelanggan
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              NO REG
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customerDetail.noReg}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                NOPEL
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {customerDetail.nopel}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              NAMA
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customerDetail.nama}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              ALAMAT
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customerDetail.alamat}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              WILAYAH
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customerDetail.wilayah}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              RAYON
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customerDetail.rayon}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
