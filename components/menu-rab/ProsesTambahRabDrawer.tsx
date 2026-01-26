'use client';

import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';

interface ProsesTambahRabDrawerProps {
  open: boolean;
  onClose: () => void;
  totalMaterial: number;
}

export default function ProsesTambahRabDrawer({
  open,
  onClose,
  totalMaterial,
}: ProsesTambahRabDrawerProps): React.ReactElement {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px',
          height: '100%',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 3,
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
        }}
      >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#333',
            }}
          >
            Perhitungan
          </Typography>

          {/* TOTAL Material */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              TOTAL Material
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={totalMaterial.toLocaleString('id-ID')}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Box>

          {/* TOTAL Ongkos */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              TOTAL Ongkos
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF8C00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                  },
                },
              }}
            />
          </Box>

          {/* Diskons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              Diskons (TARIF)
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF8C00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                  },
                },
              }}
            />
          </Box>

          <Divider />

          {/* Sub TOTAL */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              Sub TOTAL
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="0"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Box>

          {/* Biaya JASA */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              Biaya JASA
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF8C00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                  },
                },
              }}
            />
          </Box>

          {/* PPN */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              PPN
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF8C00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                  },
                },
              }}
            />
          </Box>

          {/* Pembulatan */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
              Pembulatan
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF8C00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8C00',
                  },
                },
              }}
            />
          </Box>

          {/* TOTAL RAB */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
              TOTAL RAB
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="0"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFF8E1',
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          {/* Button Simpan */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                textTransform: 'none',
                backgroundColor: '#FF8C00',
                '&:hover': {
                  backgroundColor: '#FF7F00',
                },
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Simpan
            </Button>
          </Box>
      </Box>
    </Drawer>
  );
}
