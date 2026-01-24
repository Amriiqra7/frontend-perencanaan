'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';
import type { RabFilter } from '@/types/rab';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filter: RabFilter;
  onFilterChange: (filter: RabFilter) => void;
  onReset: () => void;
}

export default function FilterDrawer({
  open,
  onClose,
  filter,
  onFilterChange,
  onReset,
}: FilterDrawerProps): React.ReactElement {
  const handleFieldChange = (field: keyof RabFilter, value: string | boolean): void => {
    onFilterChange({
      ...filter,
      [field]: value,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Drawer Panel Filter
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseCircle size={24} color="#666" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', overflowX: 'hidden', pb: 1 }}>
          <Box sx={{ pt: 3, pb: 1 }}>
            <TextField
              label="TGL RAB"
              type="date"
              value={filter.tglRab || ''}
              onChange={(e) => handleFieldChange('tglRab', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  sx: {
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                    },
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  overflow: 'visible',
                },
                '& .MuiInputBase-input': {
                  overflow: 'visible',
                },
              }}
            />
          </Box>

          <TextField
            label="NO RAB"
            value={filter.noRab || ''}
            onChange={(e) => handleFieldChange('noRab', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Jenis RAB"
            value={filter.jenisRab || ''}
            onChange={(e) => handleFieldChange('jenisRab', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="No. Pel"
            value={filter.noPel || ''}
            onChange={(e) => handleFieldChange('noPel', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Nama"
            value={filter.nama || ''}
            onChange={(e) => handleFieldChange('nama', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Wilayah"
            value={filter.wilayah || ''}
            onChange={(e) => handleFieldChange('wilayah', e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="+ Rayon"
            value={filter.rayon || ''}
            onChange={(e) => handleFieldChange('rayon', e.target.value)}
            fullWidth
            size="small"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={filter.setuju || false}
                onChange={(e) => handleFieldChange('setuju', e.target.checked)}
                size="small"
              />
            }
            label="Setuju"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={filter.lunas || false}
                onChange={(e) => handleFieldChange('lunas', e.target.checked)}
                size="small"
              />
            }
            label="Lunas"
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            pt: 2,
            borderTop: '1px solid #FFE0B2',
            backgroundColor: '#fff',
            position: 'sticky',
            bottom: 0,
          }}
        >
          <Button variant="outlined" onClick={onReset} fullWidth>
            Reset
          </Button>
          <Button variant="contained" onClick={onClose} fullWidth>
            Cari Data
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
