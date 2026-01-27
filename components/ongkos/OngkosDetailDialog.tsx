'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import type { OngkosData } from '@/types/ongkos';

interface OngkosDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ongkos: OngkosData | null;
}

export default function OngkosDetailDialog({
  open,
  onClose,
  ongkos,
}: OngkosDetailDialogProps): React.ReactElement {
  if (!ongkos) {
    return <></>;
  }

  const harga = parseFloat(ongkos.harga_ongkos || '0');
  const createdDate = new Date(ongkos.created_at);
  const updatedDate = new Date(ongkos.updated_at);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        Detail Ongkos
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Kode Ongkos
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {ongkos.kode_ongkos}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Nama Ongkos
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {ongkos.nama_ongkos}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Satuan
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {ongkos.satuan_ongkos?.kode || '-'}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Rumus
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {ongkos.satuan_ongkos?.rumus || '-'}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Harga
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Rp {harga.toLocaleString('id-ID')}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Tanggal Dibuat
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {createdDate.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Tanggal Diupdate
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {updatedDate.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#FF8C00',
            '&:hover': {
              backgroundColor: '#FF7F00',
            },
            textTransform: 'none',
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
